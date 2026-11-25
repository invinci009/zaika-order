import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const key = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
if (!getApps().length) initializeApp({ credential: cert(key) });
const db = getFirestore();

async function check() {
  const snap = await db.collection('orderMenuItems').get();
  const byName = new Map();
  snap.forEach(d => {
    byName.set(d.data().name.trim().toLowerCase(), { id: d.id, pricePaise: d.data().pricePaise });
  });
  console.log('Firestore map loaded, entries:', byName.size);

  const content = fs.readFileSync('src/app/order/[slug]/menu/page.tsx', 'utf8');
  const regex = /id:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g;
  let m;
  let matched = 0, total = 0;
  const missing = [];
  while ((m = regex.exec(content)) !== null) {
    total++;
    const name = m[2].trim().toLowerCase();
    if (byName.has(name)) {
      matched++;
    } else {
      missing.push({ id: m[1], name: m[2] });
    }
  }
  console.log(`Total: ${total}, Matched: ${matched}, Missing: ${missing.length}`);
  if (missing.length > 0) {
    console.log('Sample missing:', missing.slice(0, 15));
  }
}

check().catch(console.error);
