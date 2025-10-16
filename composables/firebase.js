// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyBS1Nr5en8W49-ymmYUFV6EbwDambD5TDQ",
  authDomain: "bookie-490ce.firebaseapp.com",
  projectId: "bookie-490ce",
  storageBucket: "bookie-490ce.firebasestorage.app",
  messagingSenderId: "891293410405",
  appId: "1:891293410405:web:01fec27991d49b8bcf128c",
  measurementId: "G-K9NJYGHFZW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
