// Verify data in destination project
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey-dest.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'big-axiom-490504-d0',
});

const db = admin.firestore();

async function verify() {
  const snapshot = await db.collection('users').get();
  console.log(`Total user docs in big-axiom-490504-d0: ${snapshot.size}\n`);
  for (const doc of snapshot.docs) {
    const d = doc.data();
    const prog = d.program || [];
    const email = prog.length > 0 ? '' : '(no program)';
    console.log(`  ${doc.id.slice(0,20)}... | program: ${prog.length} days | keys: ${Object.keys(d).length}`);
  }
}

verify().catch(console.error);
