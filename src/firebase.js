import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC8J6nVm9HQfVHZ0BrIM94YXf98kSY6_JI",
  authDomain: "x-train.app",
  projectId: "big-axiom-490504-d0",
  storageBucket: "big-axiom-490504-d0.firebasestorage.app",
  messagingSenderId: "1078673306868",
  appId: "1:1078673306868:web:cf7cf961b0021e367adaa1",
  measurementId: "G-2PECW7MTZL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
