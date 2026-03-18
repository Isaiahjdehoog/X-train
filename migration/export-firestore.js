// Step 1: Export all Firestore data from x-train-2026
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'x-train-2026',
});

const db = admin.firestore();

async function exportAllData() {
  console.log('📤 Exporting Firestore data from x-train-2026...\n');

  const collections = await db.listCollections();
  const allData = {};

  for (const col of collections) {
    console.log(`  Collection: ${col.id}`);
    allData[col.id] = {};
    const snapshot = await col.get();
    for (const doc of snapshot.docs) {
      allData[col.id][doc.id] = doc.data();
    }
    console.log(`    → ${snapshot.size} document(s)`);
  }

  fs.writeFileSync(
    path.join(__dirname, 'firestore-export.json'),
    JSON.stringify(allData, null, 2)
  );

  console.log('\n✅ Exported to migration/firestore-export.json');
  console.log('\nSummary:');
  for (const [col, docs] of Object.entries(allData)) {
    console.log(`  ${col}: ${Object.keys(docs).length} docs`);
  }
}

exportAllData().catch(console.error);
