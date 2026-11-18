import QuizFlow, { type QuizAnswerValue } from '@/components/quiz/QuizFlow'
import { Sparkles, AlertTriangle } from 'lucide-react'
import { cookies } from 'next/headers'
import { getRestaurantConfig } from '@/config/loader'
import { MandalaBackground } from '@/components/ordering/MandalaBackground'

interface PublicQuizPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ new?: string }>
}

export default async function PublicQuizPage({ params, searchParams }: PublicQuizPageProps) {
  const { slug } = await params
  const { new: forceNew } = await searchParams
  const config = getRestaurantConfig()

  // 1. Look up campaign by slug.
  let backendUnavailable = false
  let firestore: typeof import('@/lib/firebase/firestore') | null = null
  try {
    firestore = await import('@/lib/firebase/firestore')
  } catch (err) {
    console.error('PublicQuizPage: backend import failed:', err)
    backendUnavailable = true
  }

  let campaign = firestore
    ? await firestore.getCampaignBySlug(slug).catch((err) => {
        console.error('PublicQuizPage: campaign lookup failed:', err)
        backendUnavailable = true
        return null
      })
    : null

  // Graceful fallback: If this slug was deleted or user enters custom slug, resolve to the active campaign
  if (firestore && !campaign && !backendUnavailable) {
    const campaigns = await firestore
      .getCampaigns()
      .catch((err) => {
        console.error('PublicQuizPage: campaigns fallback failed:', err)
        backendUnavailable = true
        return null
      })
    campaign = campaigns?.find((c) => c.active) || null
  }

  // Backend (Firestore) unreachable — friendly fallback in PM Zaika royal dark theme
  if (backendUnavailable) {
    return (
      <div
        className="min-h-screen text-[#f5f0e8] flex items-center justify-center p-4 relative"
        style={{ background: 'linear-gradient(175deg, #1c1426 0%, #150e1f 45%, #0e0815 100%)' }}
      >
        <MandalaBackground />
        <div className="w-full max-w-sm text-center p-6 sm:p-8 rounded-3xl bg-[#170e24]/90 border border-amber-500/30 shadow-2xl relative z-10 space-y-4 backdrop-blur-md">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffe49e] via-[#f7d77a] to-[#d4af37]">
            Feedback Temporarily Unavailable
          </h1>
          <p className="text-xs text-amber-200/70">
            We&apos;re having trouble reaching our servers right now. Please try again in a moment, or ask your server at {config.name} for assistance.
          </p>
          {config.contact.phone && (
            <div className="pt-2">
              <a
                href={`tel:${config.contact.phone}`}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-xs font-semibold text-amber-300 hover:bg-amber-400/25 transition-colors"
              >
                Call: {config.contact.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Fallback screen if no campaign exists at all
  if (!campaign) {
    return (
      <div
        className="min-h-screen text-[#f5f0e8] flex items-center justify-center p-4 relative"
        style={{ background: 'linear-gradient(175deg, #1c1426 0%, #150e1f 45%, #0e0815 100%)' }}
      >
        <MandalaBackground />
        <div className="w-full max-w-sm text-center p-6 sm:p-8 rounded-3xl bg-[#170e24]/90 border border-rose-500/30 shadow-2xl relative z-10 space-y-4 backdrop-blur-md">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#f5f0e8]">QR Code Not Found</h1>
          <p className="text-xs text-amber-200/70">
            This QR code is not valid or has been removed. Please ask your server at {config.name} for assistance.
          </p>
          {config.contact.phone && (
            <div className="pt-2">
              <a
                href={`tel:${config.contact.phone}`}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-xs font-semibold text-amber-300 hover:bg-amber-400/25 transition-colors"
              >
                Call: {config.contact.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Inactive campaign fallback screen
  if (!campaign.active) {
    return (
      <div
        className="min-h-screen text-[#f5f0e8] flex items-center justify-center p-4 relative"
        style={{ background: 'linear-gradient(175deg, #1c1426 0%, #150e1f 45%, #0e0815 100%)' }}
      >
        <MandalaBackground />
        <div className="w-full max-w-sm text-center p-6 sm:p-8 rounded-3xl bg-[#170e24]/90 border border-amber-500/30 shadow-2xl relative z-10 space-y-4 backdrop-blur-md">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#f5f0e8]">Survey Temporarily Inactive</h1>
          <p className="text-xs text-amber-200/70">
            This feedback code is currently paused by {config.name}. Please check with your server.
          </p>
          {config.contact.phone && (
            <div className="pt-2">
              <a
                href={`tel:${config.contact.phone}`}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-xs font-semibold text-amber-300 hover:bg-amber-400/25 transition-colors"
              >
                Call: {config.contact.phone}
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  const googleReviewUrl = campaign.googleReviewUrlOverride || config.google.reviewUrl

  // 2. Fetch menu items for the ordered items step
  const menuItems = firestore
    ? await firestore.getMenuItems().catch((err) => {
        console.error('PublicQuizPage: menu items lookup failed:', err)
        return []
      })
    : []

  // 3. Resume existing session if cookie is present and ?new=1 is NOT passed
  let existingSessionId: string | null = null
  let existingStatus: string | null = null
  const existingAnswers: Record<string, unknown> = {}
  let existingDraftText: string | null = null

  if (firestore && forceNew !== '1') {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('rp_session')
    if (sessionCookie?.value) {
      try {
        const session = await firestore.getSession(sessionCookie.value)
        if (session && session.campaignId === campaign.id) {
          existingSessionId = session.id
          existingStatus = session.status

          const answers = await firestore.getSessionAnswers(session.id)
          for (const a of answers) {
            existingAnswers[a.questionKey] = a.value
          }

          if (session.status === 'completed') {
            const draft = await firestore.getReviewDraft(session.id)
            if (draft) {
              existingDraftText = draft.finalText || draft.originalText || null
            }
          }
        }
      } catch (err) {
        console.error('PublicQuizPage: session resume failed, starting fresh:', err)
      }
    }
  }

  const restaurantName = config.name
  const welcomeText = config.welcomeMessage[config.settings.defaultLanguage] || config.welcomeMessage['en'] || ''

  return (
    <div
      className="min-h-screen min-h-[100dvh] min-h-safe-screen text-[#f5f0e8] flex flex-col justify-between px-3 sm:px-6 pt-safe pb-safe py-3 sm:py-6 selection:bg-amber-500 selection:text-black relative overflow-x-hidden font-sans"
      style={{ background: 'linear-gradient(175deg, #1c1426 0%, #150e1f 45%, #0e0815 100%)' }}
    >
      {/* Ornamental Mandala Background Layer */}
      <MandalaBackground />

      {/* Header Badge */}
      <header className="relative z-10 flex items-center justify-center pt-1 sm:pt-2">
        <div className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#1b1026]/90 border border-amber-500/30 shadow-md backdrop-blur-md">
          <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400 shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-bold text-amber-200 tracking-wider uppercase">
            {restaurantName} • Guest Feedback
          </span>
        </div>
      </header>

      {/* Quiz Flow Orchestration */}
      <QuizFlow
        slug={campaign.slug}
        restaurantName={restaurantName}
        logoUrl={config.branding.logoUrl}
        primaryColor={config.branding.primaryColor}
        welcomeMessage={welcomeText}
        googleReviewUrl={googleReviewUrl}
        initialSessionId={existingSessionId}
        initialStatus={existingStatus}
        initialAnswers={existingAnswers as Record<string, QuizAnswerValue>}
        initialDraftText={existingDraftText}
        menuItems={menuItems}
      />

      {/* Mobile-Friendly Footer */}
      <footer className="relative z-10 text-center py-2 sm:py-3 text-[10px] sm:text-[11px] text-amber-200/50 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
        <div className="flex items-center gap-1.5">
          <span>Powered by</span>
          <span className="font-bold text-amber-300">PM Zaika</span>
          <span>•</span>
          <span className="font-semibold text-amber-100">{restaurantName}</span>
        </div>
        {config.contact.phone && (
          <div className="flex items-center gap-1 text-amber-300 font-medium">
            <span>•</span>
            <a href={`tel:${config.contact.phone}`} className="hover:underline flex items-center gap-1">
              <span>Helpline:</span>
              <strong>{config.contact.phone}</strong>
            </a>
          </div>
        )}
      </footer>
    </div>
  )
}
