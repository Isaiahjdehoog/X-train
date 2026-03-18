// Step 2: Import Firestore data into big-axiom-490504-d0
// Requires: serviceAccountKey-dest.json (service account for big-axiom-490504-d0)
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('./serviceAccountKey-dest.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'big-axiom-490504-d0',
});

const db = admin.firestore();

async function importAllData() {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'firestore-export.json'), 'utf8')
  );

  console.log('📥 Importing Firestore data into big-axiom-490504-d0...\n');

  for (const [colId, docs] of Object.entries(data)) {
    console.log(`  Collection: ${colId} (${Object.keys(docs).length} docs)`);
    const col = db.collection(colId);

    // Batch writes — Firestore limit is 500 per batch
    const entries = Object.entries(docs);
    const BATCH_SIZE = 400;

    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      const batch = db.batch();
      const chunk = entries.slice(i, i + BATCH_SIZE);
      for (const [docId, docData] of chunk) {
        batch.set(col.doc(docId), docData);
      }
      await batch.commit();
      console.log(`    → Wrote docs ${i + 1}–${Math.min(i + BATCH_SIZE, entries.length)}`);
    }
  }

  console.log('\n✅ Firestore import complete');
}

importAllData().catch(console.error);
