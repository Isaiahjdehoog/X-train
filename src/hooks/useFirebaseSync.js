import { useEffect, useRef, useCallback } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAppData, KEYS } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';

export function useFirebaseSync(setSyncStatus) {
  const { currentUser } = useAuth();
  const { getCloudSnapshot, restoreFromCloud, registerTriggerSync } = useAppData();
  const syncTimeoutRef = useRef(null);
  const hasSyncedRef = useRef(false);

  const showSync = useCallback((msg) => {
    if (setSyncStatus) setSyncStatus(msg);
  }, [setSyncStatus]);

  const saveToCloud = useCallback(async () => {
    if (!currentUser) return;
    try {
      const snapshot = getCloudSnapshot();
      await setDoc(doc(db, 'users', currentUser.uid), {
        ...snapshot,
        lastModified: serverTimestamp(),
      });
      showSync('Synced ✓');
      setTimeout(() => showSync(''), 3000);
    } catch (err) {
      console.error('Error saving to cloud:', err);
      showSync('Sync failed ✗');
      setTimeout(() => showSync(''), 3000);
    }
  }, [currentUser, getCloudSnapshot, showSync]);

  const triggerSync = useCallback(() => {
    clearTimeout(syncTimeoutRef.current);
    showSync('Syncing...');
    syncTimeoutRef.current = setTimeout(saveToCloud, 2000);
  }, [saveToCloud, showSync]);

  // Register triggerSync with AppDataContext so data mutations can call it
  useEffect(() => {
    registerTriggerSync(triggerSync);
  }, [triggerSync, registerTriggerSync]);

  // Sync from cloud on first sign-in for this session
  useEffect(() => {
    if (!currentUser) return;

    const SESSION_KEY = `session-loaded-${currentUser.uid}`;
    const hasLoadedThisSession = sessionStorage.getItem(SESSION_KEY);

    if (hasLoadedThisSession || hasSyncedRef.current) {
      hasSyncedRef.current = true;
      return;
    }

    async function syncFromCloud() {
      try {
        console.log('🔍 Checking for cloud data...');
        const snapshot = await getDoc(doc(db, 'users', currentUser.uid));
        if (!snapshot.exists()) {
          console.log('📤 No cloud data found');
          return;
        }
        const data = snapshot.data();
        if (!data.program || data.program.length === 0) {
          console.log('📋 No program data yet');
          return;
        }

        sessionStorage.setItem(SESSION_KEY, 'true');
        hasSyncedRef.current = true;

        restoreFromCloud(data);
        console.log('✅ Initial sync complete');
        setTimeout(() => showSync('Synced ✓'), 100);
        setTimeout(() => showSync(''), 3100);
      } catch (err) {
        console.error('❌ Error loading data:', err);
        showSync('Sync failed ✗');
        setTimeout(() => showSync(''), 3000);
      }
    }

    syncFromCloud();
  }, [currentUser, restoreFromCloud, showSync]);

  // Pull-to-refresh touch listener
  useEffect(() => {
    if (!currentUser) return;
    let pullStartY = 0;
    let pullMoveY = 0;
    let isPulling = false;

    const onTouchStart = (e) => {
      if (window.scrollY === 0) {
        pullStartY = e.touches[0].screenY;
        isPulling = true;
      }
    };
    const onTouchMove = (e) => {
      if (!isPulling) return;
      pullMoveY = e.touches[0].screenY;
      if (pullMoveY - pullStartY > 80) showSync('Release to sync...');
    };
    const onTouchEnd = async () => {
      if (!isPulling) return;
      const dist = pullMoveY - pullStartY;
      if (dist > 80) {
        showSync('Syncing...');
        try {
          const snapshot = await getDoc(doc(db, 'users', currentUser.uid));
          if (snapshot.exists()) {
            const data = snapshot.data();
            restoreFromCloud(data);
            showSync('Synced ✓');
            setTimeout(() => showSync(''), 3000);
          }
        } catch (err) {
          console.error('Pull-to-refresh sync error:', err);
          showSync('Sync failed ✗');
          setTimeout(() => showSync(''), 3000);
        }
      }
      isPulling = false;
      pullStartY = 0;
      pullMoveY = 0;
    };

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [currentUser, restoreFromCloud, showSync]);

  return { triggerSync, saveToCloud };
}
