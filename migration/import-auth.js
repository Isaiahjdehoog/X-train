// Step 3: Import Auth users into big-axiom-490504-d0
// Requires: serviceAccountKey-dest.json + users-export.json + hash params below
//
// Before running, fill in the hash parameters from:
// x-train-2026 Firebase Console → Authentication → ⋮ menu → Password hash parameters
const HASH_CONFIG = {
  algorithm: 'SCRYPT',
  base64SignerKey: 'OMGBAOtneHuZi83o37S5yvY7ujeC9NE67vHLteBdi3iIaOHdD7cvhUWCc0pb4QJRKrdnfkTdsMzyBicz5sLzfw==',
  base64SaltSeparator: 'Bw==',
  rounds: 8,
  memCost: 14,
};

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('./serviceAccountKey-dest.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'big-axiom-490504-d0',
});

async function importUsers() {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'users-export.json'), 'utf8')
  );
  const users = data.users || [];

  console.log(`📥 Importing ${users.length} auth users into big-axiom-490504-d0...\n`);

  // Firebase importUsers limit: 1,000 per call
  const BATCH_SIZE = 1000;
  let totalSuccess = 0;
  let totalErrors = 0;

  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const chunk = users.slice(i, i + BATCH_SIZE);

    const importUsers = chunk.map(u => {
      const record = {
        uid: u.localId,
        email: u.email,
        emailVerified: u.emailVerified || false,
        displayName: u.displayName,
        photoURL: u.photoURL,
        disabled: u.disabled || false,
        metadata: {
          creationTime: u.createdAt
            ? new Date(parseInt(u.createdAt)).toUTCString()
            : undefined,
          lastSignInTime: u.lastLoginAt
            ? new Date(parseInt(u.lastLoginAt)).toUTCString()
            : undefined,
        },
        providerData: (u.providerUserInfo || []).map(p => ({
          uid: p.rawId || p.federatedId,
          displayName: p.displayName,
          email: p.email,
          photoURL: p.photoURL,
          providerId: p.providerId,
        })),
        customClaims: u.customAttributes ? JSON.parse(u.customAttributes) : undefined,
      };

      // Include password hash if present
      if (u.passwordHash) {
        record.passwordHash = Buffer.from(u.passwordHash, 'base64');
        if (u.salt) record.passwordSalt = Buffer.from(u.salt, 'base64');
      }

      return record;
    });

    const result = await admin.auth().importUsers(importUsers, {
      hash: {
        algorithm: HASH_CONFIG.algorithm,
        key: Buffer.from(HASH_CONFIG.base64SignerKey, 'base64'),
        saltSeparator: Buffer.from(HASH_CONFIG.base64SaltSeparator, 'base64'),
        rounds: HASH_CONFIG.rounds,
        memoryCost: HASH_CONFIG.memCost,
      },
    });

    totalSuccess += result.successCount;
    totalErrors += result.failureCount;

    console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${result.successCount} succeeded, ${result.failureCount} failed`);

    if (result.errors && result.errors.length > 0) {
      for (const err of result.errors) {
        const u = chunk[err.index];
        console.error(`    ✗ ${u?.email || 'unknown'}: ${err.error.message}`);
      }
    }
  }

  console.log(`\n✅ Auth import complete: ${totalSuccess} succeeded, ${totalErrors} failed`);
}

importUsers().catch(console.error);
