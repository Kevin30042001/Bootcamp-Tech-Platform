// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBMpKwvkxjFNEIm5-JAZhQ9c1ZOYlmWVGc",
  authDomain: "bootcamp-app-626df.firebaseapp.com",
  projectId: "bootcamp-app-626df",
  storageBucket: "bootcamp-app-626df.appspot.com",
  messagingSenderId: "998838784718",
  appId: "1:998838784718:web:38275c3c895489a452769f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Admin helper function
export const isUserAdmin = async (email: string | null): Promise<boolean> => {
  if (!email) return false;
  try {
    const adminRef = collection(db, 'admins');
    const q = query(adminRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Optional: Helper function to check if app is initialized
export const getFirebaseApp = () => app;