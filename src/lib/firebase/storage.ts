import 'server-only'
import { randomUUID } from 'crypto'
import { getAdminStorage } from './admin'

// ==============================================================================
// Resilient Storage Engine (Supabase Storage Primary + Firebase Storage Fallback)
// Prioritizes Supabase public bucket storage for instant CDN-backed image uploads
// without waiting on uninitialized Firebase Storage buckets.
// ==============================================================================

const SUPABASE_BUCKET = 'menu-items'
let bucketReadyPromise: Promise<void> | null = null

function getStorageBucket() {
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim()
  if (!bucketName) {
    throw new Error('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not set.')
  }
  return getAdminStorage().bucket(bucketName)
}

async function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim()

  if (!supabaseUrl || !supabaseKey) {
    return null
  }

  const { createClient } = await import('@supabase/supabase-js')
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

async function ensureSupabaseBucket(supabase: NonNullable<Awaited<ReturnType<typeof getSupabaseClient>>>) {
  if (bucketReadyPromise) {
    await bucketReadyPromise
    return
  }

  bucketReadyPromise = (async () => {
    try {
      const { data } = await supabase.storage.getBucket(SUPABASE_BUCKET)
      if (!data) {
        await supabase.storage.createBucket(SUPABASE_BUCKET, { public: true }).catch(() => {})
      } else if (!data.public) {
        await supabase.storage.updateBucket(SUPABASE_BUCKET, { public: true }).catch(() => {})
      }
    } catch {
      // If using anon key without admin bucket permissions, upload will still proceed if bucket exists
    }
  })()

  try {
    await bucketReadyPromise
  } catch {
    bucketReadyPromise = null
  }
}

/**
 * Upload to Supabase Storage with long-lived CDN cache headers.
 */
async function uploadToSupabaseStorage(
  cleanPath: string,
  data: Buffer,
  contentType: string
): Promise<string> {
  const supabase = await getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase storage credentials not configured')
  }

  await ensureSupabaseBucket(supabase)

  const { error } = await supabase.storage.from(SUPABASE_BUCKET).upload(cleanPath, data, {
    contentType,
    cacheControl: '31536000',
    upsert: true,
  })

  if (error) {
    throw new Error(`Supabase Storage upload error: ${error.message}`)
  }

  const { data: pubData } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(cleanPath)
  return pubData.publicUrl
}

async function uploadToFirebaseStorage(
  cleanPath: string,
  data: Buffer,
  contentType: string
): Promise<string> {
  const bucket = getStorageBucket()
  const file = bucket.file(cleanPath)
  const downloadToken = randomUUID()

  await file.save(data, {
    resumable: false,
    validation: false,
    metadata: {
      contentType,
      cacheControl: 'public, max-age=31536000, immutable',
      metadata: {
        firebaseStorageDownloadTokens: downloadToken,
      },
    },
  })

  await file.makePublic().catch(() => {})
  const encodedPath = encodeURIComponent(cleanPath)
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${downloadToken}`
}

/**
 * Upload a file to Storage (Supabase Storage primary, Firebase Storage fallback).
 */
export async function uploadFile(
  path: string,
  data: Buffer,
  contentType: string
): Promise<string> {
  const cleanPath = path.replace(/^\/+/, '')

  // 1. Primary: Supabase Storage (zero-hang, public CDN URL, free quota friendly)
  let supabaseErr: unknown = null
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim())
  )

  if (hasSupabase) {
    try {
      return await uploadToSupabaseStorage(cleanPath, data, contentType)
    } catch (err) {
      supabaseErr = err
      console.warn(
        'Supabase Storage upload failed, falling back to Firebase Storage:',
        err instanceof Error ? err.message : err
      )
    }
  }

  // 2. Fallback: Firebase Storage
  try {
    return await uploadToFirebaseStorage(cleanPath, data, contentType)
  } catch (fbError: unknown) {
    const firstMsg =
      supabaseErr instanceof Error
        ? supabaseErr.message
        : fbError instanceof Error
          ? fbError.message
          : String(fbError)
    throw new Error(`Upload failed: ${firstMsg}`)
  }
}

/**
 * Delete a file from Storage.
 */
export async function deleteFile(path: string): Promise<void> {
  const cleanPath = path.replace(/^\/+/, '')

  try {
    const supabase = await getSupabaseClient()
    if (supabase) {
      await supabase.storage.from(SUPABASE_BUCKET).remove([cleanPath])
    }
  } catch (err) {
    console.warn('Supabase storage delete warning:', err)
  }

  try {
    const bucket = getStorageBucket()
    const file = bucket.file(cleanPath)
    await file.delete().catch(() => {})
  } catch (err) {
    console.warn('Firebase storage delete warning:', err)
  }
}

/**
 * Check if a file exists in Storage.
 */
export async function fileExists(path: string): Promise<boolean> {
  const cleanPath = path.replace(/^\/+/, '')

  try {
    const supabase = await getSupabaseClient()
    if (supabase) {
      const folder = cleanPath.includes('/') ? cleanPath.slice(0, cleanPath.lastIndexOf('/')) : ''
      const fileName = cleanPath.includes('/') ? cleanPath.slice(cleanPath.lastIndexOf('/') + 1) : cleanPath
      const { data } = await supabase.storage.from(SUPABASE_BUCKET).list(folder, { search: fileName })
      if (data && data.some((f) => f.name === fileName)) return true
    }
  } catch {
    // continue
  }

  try {
    const bucket = getStorageBucket()
    const file = bucket.file(cleanPath)
    const [exists] = await file.exists()
    if (exists) return true
  } catch {
    // continue
  }

  return false
}

/**
 * Get a public URL for a file.
 */
export function getPublicUrl(path: string): string {
  const cleanPath = path.replace(/^\/+/, '')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()?.replace(/\/+$/, '')
  if (supabaseUrl) {
    return `${supabaseUrl}/storage/v1/object/public/${SUPABASE_BUCKET}/${cleanPath}`
  }
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || 'default'
  const encodedPath = encodeURIComponent(cleanPath)
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`
}

/**
 * Generate a signed URL for temporary access to a file.
 */
export async function getSignedUrl(path: string, expiresInMinutes = 60): Promise<string> {
  const cleanPath = path.replace(/^\/+/, '')

  try {
    const supabase = await getSupabaseClient()
    if (supabase) {
      const { data } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .createSignedUrl(cleanPath, expiresInMinutes * 60)
      if (data?.signedUrl) return data.signedUrl
    }
  } catch {
    // continue
  }

  try {
    const bucket = getStorageBucket()
    const file = bucket.file(cleanPath)
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresInMinutes * 60 * 1000,
    })
    return url
  } catch {
    return getPublicUrl(path)
  }
}
