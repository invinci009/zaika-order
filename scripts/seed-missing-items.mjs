import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const key = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
if (!getApps().length) initializeApp({ credential: cert(key) });
const db = getFirestore();
const now = new Date().toISOString();

async function seedMissing() {
  const items = [
    {
      id: 'mutton-handi-biryani',
      name: 'Mutton Handi Biryani',
      pricePaise: 38000,
      veg: 'nonveg',
      categoryId: 'Fe5Lt15lUrODyg47M3Ln', // BIRYANI
      available: true,
      visible: true,
      featured: true,
      position: 1,
      options: [
        {
          id: 'portion',
          name: 'Portion Size',
          type: 'single',
          required: false,
          min: 0,
          max: 1,
          choices: [
            { id: 'full', name: 'Full Handi', pricePaise: 0 },
            { id: 'half', name: 'Half Handi', pricePaise: -16000 },
          ],
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'chicken-dum-biryani',
      name: 'Chicken Dum Biryani',
      pricePaise: 29000,
      veg: 'nonveg',
      categoryId: 'Fe5Lt15lUrODyg47M3Ln', // BIRYANI
      available: true,
      visible: true,
      featured: true,
      position: 2,
      options: [
        {
          id: 'portion',
          name: 'Portion Size',
          type: 'single',
          required: false,
          min: 0,
          max: 1,
          choices: [
            { id: 'full', name: 'Full Handi', pricePaise: 0 },
            { id: 'half', name: 'Half Handi', pricePaise: -12000 },
          ],
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'double-egg-chicken-roll',
      name: 'Double Egg Chicken Roll',
      pricePaise: 16000,
      veg: 'nonveg',
      categoryId: 'HRLwtzRJQbXFeoGnLlj5',
      available: true,
      visible: true,
      featured: false,
      position: 3,
      options: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'paneer-kathi-roll',
      name: 'Paneer Kathi Roll',
      pricePaise: 13000,
      veg: 'veg',
      categoryId: 'cvLqf6t7igDZNLcfT1vz',
      available: true,
      visible: true,
      featured: false,
      position: 4,
      options: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'special-murg-mussallam-pcs',
      name: 'Murg Mussallam (Piece)',
      pricePaise: 65000,
      veg: 'nonveg',
      categoryId: 'mehman_nawazi',
      available: true,
      visible: true,
      featured: true,
      position: 6,
      options: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'special-mutton-raan-e-arabia',
      name: 'Mutton Rane-E-Arabia',
      pricePaise: 250000,
      veg: 'nonveg',
      categoryId: 'mehman_nawazi',
      available: true,
      visible: true,
      featured: true,
      position: 7,
      options: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'special-chicken-biryani-handi-45',
      name: 'Chicken Biryani Handi (40-45 Persons)',
      pricePaise: 750000,
      veg: 'nonveg',
      categoryId: 'mehman_nawazi',
      available: true,
      visible: true,
      featured: true,
      position: 9,
      options: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'special-chicken-biryani-handi-80',
      name: 'Chicken Biryani Handi (75-80 Persons)',
      pricePaise: 1350000,
      veg: 'nonveg',
      categoryId: 'mehman_nawazi',
      available: true,
      visible: true,
      featured: true,
      position: 10,
      options: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'special-mutton-biryani-handi-45',
      name: 'Mutton Biryani Handi (40-45 Persons)',
      pricePaise: 1250000,
      veg: 'nonveg',
      categoryId: 'mehman_nawazi',
      available: true,
      visible: true,
      featured: true,
      position: 11,
      options: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'special-mutton-biryani-handi-80',
      name: 'Mutton Biryani Handi (75-80 Persons)',
      pricePaise: 2200000,
      veg: 'nonveg',
      categoryId: 'mehman_nawazi',
      available: true,
      visible: true,
      featured: true,
      position: 12,
      options: [],
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const item of items) {
    await db.doc(`orderMenuItems/${item.id}`).set(item, { merge: true });
    console.log(`Seeded: ${item.name} (${item.id})`);
  }
}

seedMissing().catch(console.error);
