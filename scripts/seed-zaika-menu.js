#!/usr/bin/env node

/**
 * PM Zaika Restaurant — Menu Seed Script
 *
 * Seeds all order-menu categories and items into Firestore (orderMenuCategories + orderMenuItems).
 * Also creates a default campaign if none exists.
 *
 * Usage:
 *   node scripts/seed-zaika-menu.js
 *
 * Requirements:
 *   - FIREBASE_SERVICE_ACCOUNT_KEY in .env.local (JSON string or base64)
 *   - npm install dotenv firebase-admin (already in devDependencies)
 */

// Load .env.local
require('dotenv').config({ path: require('path').join(process.cwd(), '.env.local') });

const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// ==============================================================================
// Firebase Init
// ==============================================================================

const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountRaw) {
  console.error('ERROR: FIREBASE_SERVICE_ACCOUNT_KEY is not set in .env.local');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountRaw);
} catch {
  try {
    serviceAccount = JSON.parse(Buffer.from(serviceAccountRaw, 'base64').toString('utf-8'));
  } catch {
    console.error('ERROR: FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON or base64-encoded JSON.');
    process.exit(1);
  }
}

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

// ==============================================================================
// Constants
// ==============================================================================

const RESTAURANT_ID = 'default';
const now = () => new Date().toISOString();

// ==============================================================================
// Menu Data
// All prices in PAISE (₹ × 100)
// veg field: 'veg' | 'nonveg' | 'egg' | 'none'
// ==============================================================================

const MENU = [
  {
    id: 'soup',
    name: 'SOUP',
    items: [
      { name: 'Veg Sweet Corn',         pricePaise: 11000, veg: 'veg' },
      { name: 'Sweet Corn (Non Veg)',    pricePaise: 14000, veg: 'nonveg' },
      { name: 'Hot N Sour (Veg)',        pricePaise: 11000, veg: 'veg' },
      { name: 'Hot N Sour (Non Veg)',    pricePaise: 14000, veg: 'nonveg' },
      { name: 'Veg Manchow',             pricePaise: 11000, veg: 'veg' },
      { name: 'Chicken Manchow Soup',    pricePaise: 14000, veg: 'nonveg' },
      { name: 'Mushroom Soup',           pricePaise: 11000, veg: 'veg' },
      { name: 'Chicken Mushroom Soup',   pricePaise: 16000, veg: 'nonveg' },
    ],
  },
  {
    id: 'starter-veg',
    name: 'STARTER VEG',
    items: [
      { name: 'Mix Veg Manchurian Dry',    pricePaise: 25000, veg: 'veg' },
      { name: 'French Fry',                pricePaise:  9000, veg: 'veg' },
      { name: 'Penuts Masala',             pricePaise: 10000, veg: 'veg' },
      { name: 'Paneer Chili Dry',          pricePaise: 22000, veg: 'veg' },
      { name: 'Paneer Pakora',             pricePaise: 20000, veg: 'veg' },
      { name: 'Gobi Manchurian',           pricePaise: 20000, veg: 'veg' },
      { name: 'Veg Chili Dry',             pricePaise: 20000, veg: 'veg' },
      { name: 'Paneer 65',                 pricePaise: 22000, veg: 'veg' },
      { name: 'Crispy Chili Potatos',      pricePaise: 15000, veg: 'veg' },
      { name: 'Honey Chili Potatos',       pricePaise: 18000, veg: 'veg' },
      { name: 'Crispy Baby Corn Chilli',   pricePaise: 24000, veg: 'veg' },
      { name: 'Veg Cheese Roll',           pricePaise: 20000, veg: 'veg' },
      { name: 'Mashroom Chili Dry',        pricePaise: 22000, veg: 'veg' },
    ],
  },
  {
    id: 'starter-nonveg',
    name: 'STARTER NON VEG',
    items: [
      { name: 'Chicken Lollypop',              pricePaise: 23000, veg: 'nonveg' },
      { name: 'Chicken Pakora',                pricePaise: 22000, veg: 'nonveg' },
      { name: 'Chicken Fried (2 Pic Leg)',      pricePaise: 22000, veg: 'nonveg' },
      { name: 'Chicken Fried (800 gm Chicken)', pricePaise: 42000, veg: 'nonveg' },
      { name: 'Chicken Crunchy',               pricePaise: 22000, veg: 'nonveg' },
      { name: 'Honey Chicken Chilli Dry',      pricePaise: 26000, veg: 'nonveg' },
      { name: 'Chicken Manchurian Dry',        pricePaise: 26000, veg: 'nonveg' },
      { name: 'Chicken Chili Bonless Dry',     pricePaise: 22000, veg: 'nonveg' },
      { name: 'Chicken 65',                    pricePaise: 25000, veg: 'nonveg' },
      { name: 'Chicken Chilli Bone Dry',       pricePaise: 20000, veg: 'nonveg' },
      { name: 'Lemon Chilli Dry',              pricePaise: 25000, veg: 'nonveg' },
      { name: 'Butter Chicken Chilli Dry',     pricePaise: 26000, veg: 'nonveg' },
      { name: 'Egg Chili Dry',                 pricePaise: 15000, veg: 'egg' },
    ],
  },
  {
    id: 'indian-nonveg-curry',
    name: 'INDIAN NON VEG CURRY',
    items: [
      { name: 'Egg Curry',                            pricePaise: 10000, veg: 'egg' },
      { name: 'Egg Do Payaza',                        pricePaise: 12000, veg: 'egg' },
      { name: 'Egg Kadhai',                           pricePaise: 12000, veg: 'egg' },
      { name: 'Chicken Curry',                        pricePaise: 26000, veg: 'nonveg' },
      { name: 'Chicken Hyderabadi',                   pricePaise: 28000, veg: 'nonveg' },
      { name: 'Chicken Do Payza',                     pricePaise: 28000, veg: 'nonveg' },
      { name: 'Chicken Hendi',                        pricePaise: 28000, veg: 'nonveg' },
      { name: 'Chicken Kadahi',                       pricePaise: 28000, veg: 'nonveg' },
      { name: 'Chicken Masala',                       pricePaise: 30000, veg: 'nonveg' },
      { name: 'Chicken Butter Masala',                pricePaise: 32000, veg: 'nonveg' },
      { name: 'Chicken Tikka Masala',                 pricePaise: 37000, veg: 'nonveg' },
      { name: 'Chicken Tikka Butter Masala',          pricePaise: 39000, veg: 'nonveg' },
      { name: 'Chicken Bharta',                       pricePaise: 33000, veg: 'nonveg' },
      { name: 'Chicken Leg Kabab Masala (2 Pic)',     pricePaise: 32000, veg: 'nonveg' },
      { name: 'Chicken Leg Kabab Butter Masala (2 Pic)', pricePaise: 34000, veg: 'nonveg' },
      { name: 'Chicken Dehati (6 Pic)',               pricePaise: 42000, veg: 'nonveg' },
      { name: 'Chicken Mughlai Mussalam',             pricePaise: 52000, veg: 'nonveg' },
      { name: 'Chicken Tandoori Masala',              pricePaise: 52000, veg: 'nonveg' },
      { name: 'Chicken Punjabi',                      pricePaise: 32000, veg: 'nonveg' },
      { name: 'Chicken Korhazori',                    pricePaise: 32000, veg: 'nonveg' },
      { name: 'Chicken Bhuna',                        pricePaise: 32000, veg: 'nonveg' },
      { name: 'Chicken Patiyala',                     pricePaise: 32000, veg: 'nonveg' },
      { name: 'Chicken Rata',                         pricePaise: 37000, veg: 'nonveg' },
      { name: 'Chicken Kassa',                        pricePaise: 30000, veg: 'nonveg' },
      { name: 'Chicken Istu',                         pricePaise: 30000, veg: 'nonveg' },
      { name: 'Mutton Curry (4 Pic)',                 pricePaise: 32000, veg: 'nonveg' },
      { name: 'Mutton do Payza (4 Pic)',              pricePaise: 32000, veg: 'nonveg' },
      { name: 'Mutton Hendi (4 Pic)',                 pricePaise: 32000, veg: 'nonveg' },
      { name: 'Mutton Dehati (6 Pic)',                pricePaise: 47000, veg: 'nonveg' },
      { name: 'Mutton Istu (4 Pic)',                  pricePaise: 34000, veg: 'nonveg' },
    ],
  },
  {
    id: 'tandoori',
    name: 'TANDOORI',
    items: [
      { name: 'Chicken Tandoori',       pricePaise: 40000, veg: 'nonveg' },
      { name: 'Chicken Tikka',          pricePaise: 30000, veg: 'nonveg' },
      { name: 'Chicken Reshmi Kabab',   pricePaise: 35000, veg: 'nonveg' },
      { name: 'Chicken Malai Kabab',    pricePaise: 35000, veg: 'nonveg' },
      { name: 'Chicken Leg Kabab',      pricePaise: 30000, veg: 'nonveg' },
      { name: 'Chicken Gullar Kabab',   pricePaise: 25000, veg: 'nonveg' },
      { name: 'Chicken Seekh Kabab',    pricePaise: 25000, veg: 'nonveg' },
      { name: 'Chicken Malai Seekh Kabab', pricePaise: 30000, veg: 'nonveg' },
      { name: 'Chicken Tagari',         pricePaise: 35000, veg: 'nonveg' },
    ],
  },
  {
    id: 'biryani',
    name: 'BIRYANI',
    items: [
      { name: 'Veg Biryani',        pricePaise: 14000, veg: 'veg' },
      { name: 'Paneer Biryani',     pricePaise: 15000, veg: 'veg' },
      { name: 'Egg Biryani',        pricePaise: 15000, veg: 'egg' },
      { name: 'Chicken Biryani',    pricePaise: 17000, veg: 'nonveg' },
      { name: 'Mutton Biryani',     pricePaise: 27000, veg: 'nonveg' },
      { name: 'Zaika Spl. Biryani', pricePaise: 30000, veg: 'nonveg' },
    ],
  },
  {
    id: 'indian-veg-curry',
    name: 'INDIAN VEG CURRY',
    items: [
      { name: 'Aloo Gobhi',                   pricePaise: 16000, veg: 'veg' },
      { name: 'Aloo Parwal',                  pricePaise: 16000, veg: 'veg' },
      { name: 'Aloo Matter',                  pricePaise: 16000, veg: 'veg' },
      { name: 'Aloo dum Bhojpuri',            pricePaise: 22000, veg: 'veg' },
      { name: 'Aloo Dum Kashmiri',            pricePaise: 26000, veg: 'veg' },
      { name: 'Aloo Masala',                  pricePaise: 16000, veg: 'veg' },
      { name: 'Aloo Jeera',                   pricePaise: 16000, veg: 'veg' },
      { name: 'Paneer Masala',                pricePaise: 24000, veg: 'veg' },
      { name: 'Paneer Butter Masala',         pricePaise: 25000, veg: 'veg' },
      { name: 'Paneer Do Pyazza',             pricePaise: 25000, veg: 'veg' },
      { name: 'Paneer Kadhai',                pricePaise: 25000, veg: 'veg' },
      { name: 'Paneer Handi',                 pricePaise: 25000, veg: 'veg' },
      { name: 'Paneer Lababdar',              pricePaise: 28000, veg: 'veg' },
      { name: 'Paneer Punjabi',               pricePaise: 28000, veg: 'veg' },
      { name: 'Paneer Tikka Masala',          pricePaise: 32000, veg: 'veg' },
      { name: 'Paneer Tikka Butter Masala',   pricePaise: 34000, veg: 'veg' },
      { name: 'Paneer Kofta',                 pricePaise: 30000, veg: 'veg' },
      { name: 'Malai Kofta',                  pricePaise: 30000, veg: 'veg' },
      { name: 'Paneer Mushroom Masala',       pricePaise: 30000, veg: 'veg' },
      { name: 'Paneer Mushroom Butter Masala',pricePaise: 35000, veg: 'veg' },
      { name: 'Paneer Capsicum',              pricePaise: 30000, veg: 'veg' },
      { name: 'Shahi Paneer',                 pricePaise: 30000, veg: 'veg' },
      { name: 'Mushroom Curry',               pricePaise: 28000, veg: 'veg' },
      { name: 'Mushroom Masala',              pricePaise: 28000, veg: 'veg' },
      { name: 'Mushroom Do Pyaza',            pricePaise: 28000, veg: 'veg' },
      { name: 'Mushroom Handi',               pricePaise: 28000, veg: 'veg' },
      { name: 'Mushroom Kadahi',              pricePaise: 28000, veg: 'veg' },
      { name: 'Mushroom Mather Masala',       pricePaise: 34000, veg: 'veg' },
      { name: 'Mushroom Butter Masala',       pricePaise: 32000, veg: 'veg' },
      { name: 'Mushroom Dehati',              pricePaise: 31000, veg: 'veg' },
      { name: 'Mather Paneer',                pricePaise: 20000, veg: 'veg' },
      { name: 'Kaju Paneer',                  pricePaise: 27000, veg: 'veg' },
      { name: 'Kaju Masala',                  pricePaise: 27000, veg: 'veg' },
      { name: 'Kaju Korma',                   pricePaise: 32000, veg: 'veg' },
      { name: 'Mix Veg',                      pricePaise: 21000, veg: 'veg' },
      { name: 'Veg Korma',                    pricePaise: 24000, veg: 'veg' },
      { name: 'Meth Matter Malai',            pricePaise: 24000, veg: 'veg' },
    ],
  },
  {
    id: 'veg-tandoori',
    name: 'VEG TANDOORI',
    items: [
      { name: 'Paneer Tikka',           pricePaise: 24000, veg: 'veg' },
      { name: 'Paneer Gullar Kabab',    pricePaise: 26000, veg: 'veg' },
      { name: 'Paneer Malai Tikka Kabab', pricePaise: 27000, veg: 'veg' },
      { name: 'Hara-Bhara Kabab',       pricePaise: 22000, veg: 'veg' },
      { name: 'Veg Seekh Kabab',        pricePaise: 22000, veg: 'veg' },
      { name: 'Soya Malai Kabab',       pricePaise: 22000, veg: 'veg' },
      { name: 'Seya Malai Chap',        pricePaise: 22000, veg: 'veg' },
    ],
  },
  {
    id: 'naan',
    name: 'NAAN',
    items: [
      { name: 'Plain Naan',         pricePaise:  3500, veg: 'veg' },
      { name: 'Butter Naan',        pricePaise:  4000, veg: 'veg' },
      { name: 'Garlic Naan',        pricePaise:  6000, veg: 'veg' },
      { name: 'Ginger Naan',        pricePaise:  6000, veg: 'veg' },
      { name: 'Paneer Stuff Naan',  pricePaise:  8000, veg: 'veg' },
      { name: 'Paneer Garlic Naan', pricePaise: 10000, veg: 'veg' },
      { name: 'Paneer Ginger Naan', pricePaise: 10000, veg: 'veg' },
      { name: 'Veg Stuff Naan',     pricePaise:  7000, veg: 'veg' },
      { name: 'Kulcha',             pricePaise:  2500, veg: 'veg' },
      { name: 'Paneer Kulcha',      pricePaise:  7000, veg: 'veg' },
      { name: 'Veg Stuff Kulcha',   pricePaise:  5000, veg: 'veg' },
    ],
  },
  {
    id: 'naan-nonveg',
    name: 'NAAN (NON VEG)',
    items: [
      { name: 'Chicken Stuff Naan',   pricePaise: 10000, veg: 'nonveg' },
      { name: 'Chicken Garlic Naan',  pricePaise: 14000, veg: 'nonveg' },
      { name: 'Chicken Ginger Naan',  pricePaise: 14000, veg: 'nonveg' },
      { name: 'Chicken Stuff Kulcha', pricePaise:  9000, veg: 'nonveg' },
    ],
  },
  {
    id: 'tandoori-roti',
    name: 'TANDOORI ROTI',
    items: [
      { name: 'Plain Roti',              pricePaise:  2000, veg: 'veg' },
      { name: 'Butter Roti',             pricePaise:  2500, veg: 'veg' },
      { name: 'Lactha Butter Pratha',    pricePaise:  3000, veg: 'veg' },
      { name: 'Aloo Pratha',             pricePaise:  5000, veg: 'veg' },
      { name: 'Gobi Pratha',             pricePaise:  5000, veg: 'veg' },
      { name: 'Paneer Pratha',           pricePaise:  9000, veg: 'veg' },
      { name: 'Paneer Mugalai Pratha',   pricePaise: 12000, veg: 'veg' },
      { name: 'Chicken Mugalai Pratha',  pricePaise: 15000, veg: 'nonveg' },
      { name: 'Mashroom Mugalai Pratha', pricePaise: 15000, veg: 'veg' },
    ],
  },
  {
    id: 'daal',
    name: 'INDIAN DAAL',
    items: [
      { name: 'Yellow Daal', pricePaise: 10000, veg: 'veg' },
      { name: 'Daal Fry',    pricePaise: 12000, veg: 'veg' },
      { name: 'Daal Tadka',  pricePaise: 14000, veg: 'veg' },
    ],
  },
  {
    id: 'noodles',
    name: 'NOODLES',
    items: [
      { name: 'Veg Noodles',              pricePaise: 11000, veg: 'veg' },
      { name: 'Paneer Noodles',           pricePaise: 15000, veg: 'veg' },
      { name: 'Mashroom Noodles',         pricePaise: 17000, veg: 'veg' },
      { name: 'Egg Noodles',              pricePaise: 14000, veg: 'egg' },
      { name: 'Chicken Noodles',          pricePaise: 17000, veg: 'nonveg' },
      { name: 'Mix Noodles',              pricePaise: 20000, veg: 'nonveg' },
      { name: 'Veg Hakka Noodles',        pricePaise: 14000, veg: 'veg' },
      { name: 'Paneer Hakka Noodles',     pricePaise: 17000, veg: 'veg' },
      { name: 'Mashroom Hakka Noodles',   pricePaise: 20000, veg: 'veg' },
      { name: 'Egg Hakka Noodles',        pricePaise: 17000, veg: 'egg' },
      { name: 'Chicken Hakka Noodles',    pricePaise: 22000, veg: 'nonveg' },
      { name: 'Mix Hakka Noodles',        pricePaise: 26000, veg: 'nonveg' },
      { name: 'Veg Sizwan Noodles',       pricePaise: 16000, veg: 'veg' },
      { name: 'Chicken Sizwan Noodles',   pricePaise: 22000, veg: 'nonveg' },
      { name: 'Mix Sizwan Noodles',       pricePaise: 24000, veg: 'nonveg' },
      { name: 'Paneer Sizwan Noodles',    pricePaise: 20000, veg: 'veg' },
      { name: 'Egg Sizwan Noodles',       pricePaise: 20000, veg: 'egg' },
      { name: 'Mashroom Sizwan Noodles',  pricePaise: 22000, veg: 'veg' },
    ],
  },
];

// ==============================================================================
// Helpers
// ==============================================================================

/** Idempotently create/get a campaign. Returns the campaign doc id. */
async function ensureCampaign() {
  console.log('\nChecking campaigns...');
  const snap = await db.collection('campaigns').where('slug', '==', 'pm-zaika').limit(1).get();
  if (!snap.empty) {
    const id = snap.docs[0].id;
    console.log(`  ✓ Campaign already exists (id: ${id})`);
    return id;
  }
  const ref = db.collection('campaigns').doc();
  const ts = now();
  await ref.set({
    name: 'PM Zaika - Main QR',
    slug: 'pm-zaika',
    active: true,
    createdAt: ts,
    updatedAt: ts,
  });
  console.log(`  ✓ Campaign created (id: ${ref.id})`);
  return ref.id;
}

/**
 * Seed a single category and its items. Idempotent:
 *  - If a category with the same name already has items, skip it.
 *  - If the category doc exists but has no items, add items only.
 */
async function seedCategory(categoryData, position) {
  const { id: categorySlug, name, items } = categoryData;

  // Check if category already exists (by name)
  const catSnap = await db
    .collection('orderMenuCategories')
    .where('restaurantId', '==', RESTAURANT_ID)
    .where('name', '==', name)
    .limit(1)
    .get();

  let categoryId;
  if (!catSnap.empty) {
    categoryId = catSnap.docs[0].id;
    // Check if items exist
    const existingItems = await db
      .collection('orderMenuItems')
      .where('categoryId', '==', categoryId)
      .limit(1)
      .get();
    if (!existingItems.empty) {
      console.log(`  ⟳ [${name}] already seeded — skipping`);
      return;
    }
    console.log(`  ↻ [${name}] category exists, seeding items...`);
  } else {
    // Create category
    const ref = db.collection('orderMenuCategories').doc();
    const ts = now();
    await ref.set({
      restaurantId: RESTAURANT_ID,
      name,
      position,
      active: true,
      createdAt: ts,
      updatedAt: ts,
    });
    categoryId = ref.id;
    console.log(`  + [${name}] category created (id: ${categoryId})`);
  }

  // Seed items in batches of 500 (Firestore limit)
  const BATCH_SIZE = 400;
  let itemPosition = 1;

  for (let batchStart = 0; batchStart < items.length; batchStart += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = items.slice(batchStart, batchStart + BATCH_SIZE);

    for (const item of chunk) {
      const ref = db.collection('orderMenuItems').doc();
      const ts = now();
      batch.set(ref, {
        restaurantId: RESTAURANT_ID,
        categoryId,
        name: item.name,
        pricePaise: item.pricePaise,
        available: true,
        visible: true,
        veg: item.veg,
        featured: false,
        position: itemPosition++,
        options: [],
        createdAt: ts,
        updatedAt: ts,
      });
    }
    await batch.commit();
  }

  console.log(`  ✓ [${name}] — ${items.length} items seeded`);
}

// ==============================================================================
// Main
// ==============================================================================

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║   PM Zaika Restaurant — Menu Seed Script                   ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log(`\nFirebase project: ${serviceAccount.project_id}`);

  try {
    await ensureCampaign();

    console.log(`\nSeeding ${MENU.length} menu categories...\n`);

    let totalItems = 0;
    for (let i = 0; i < MENU.length; i++) {
      await seedCategory(MENU[i], i + 1);
      totalItems += MENU[i].items.length;
    }

    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log(`║  ✓ Done! ${MENU.length} categories, ${totalItems} items seeded.                 ║`);
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    console.log('Next steps:');
    console.log('  1. Visit /admin/menu to review the seeded items');
    console.log('  2. Toggle availability/visibility as needed');
    console.log('  3. Add item images from the admin panel\n');
  } catch (err) {
    console.error('\n✗ Seeding failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

main();
