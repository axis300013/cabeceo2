import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADcFPh8fC7oEaU9QzNozmC73tirLFI8ao",
  authDomain: "cabeceo02.firebaseapp.com",
  projectId: "cabeceo02",
  storageBucket: "cabeceo02.firebasestorage.app",
  messagingSenderId: "201432360865",
  appId: "1:201432360865:web:ad249c6bd4af9284d0cde0"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});