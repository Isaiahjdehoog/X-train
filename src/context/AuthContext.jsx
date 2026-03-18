import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  getAuth, onAuthStateChanged, signInWithPopup, signInWithRedirect,
  getRedirectResult, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, signOut as firebaseSignOut, GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

function friendlyAuthError(code) {
  const messages = {
    'auth/user-not-found':         'No account found with this email address.',
    'auth/wrong-password':         'Incorrect password. Please try again.',
    'auth/invalid-email':          'Please enter a valid email address.',
    'auth/email-already-in-use':   'An account with this email already exists.',
    'auth/weak-password':          'Password must be at least 6 characters.',
    'auth/too-many-requests':      'Too many attempts. Please wait a moment and try again.',
    'auth/invalid-credential':     'Incorrect email or password.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
  };
  return messages[code] || 'Something went wrong. Please try again.';
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result from iOS standalone Google sign-in
    getRedirectResult(auth).then(result => {
      if (result && result.user) {
        console.log('✅ Redirect sign-in complete:', result.user.email);
      }
    }).catch(error => {
      if (error.code !== 'auth/no-auth-event') {
        console.error('Error handling redirect result:', error);
      }
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const isIOSStandalone = window.navigator.standalone === true;

    if (isIOSStandalone) {
      try {
        await signInWithRedirect(auth, provider);
      } catch (error) {
        console.error('Error signing in with redirect:', error);
        alert('Error signing in: ' + error.message);
      }
      return null;
    }

    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error('Error signing in:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        throw new Error(friendlyAuthError(error.code));
      }
      return null;
    }
  }, []);

  const signInWithEmail = useCallback(async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: friendlyAuthError(error.code) };
    }
  }, []);

  const signUpWithEmail = useCallback(async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: friendlyAuthError(error.code) };
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      return { error: friendlyAuthError(error.code) };
    }
  }, []);

  const signOut = useCallback(async (saveBeforeSignOut) => {
    try {
      if (saveBeforeSignOut) await saveBeforeSignOut();
      localStorage.clear();
      sessionStorage.clear();
      await firebaseSignOut(auth);
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error signing out: ' + error.message);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser, authLoading,
      signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
