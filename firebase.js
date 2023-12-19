
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import { getFirestore, collection, addDoc, setDoc ,doc , deleteDoc  ,serverTimestamp ,getDocs ,onSnapshot,  query, orderBy, limit ,updateDoc   } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyD7pvJuZOX2O-tZJRfcuhPSUyZDZyi1Wbs",
  authDomain: "fir-users-auth-fc835.firebaseapp.com",
  projectId: "fir-users-auth-fc835",
  storageBucket: "fir-users-auth-fc835.appspot.com",
  messagingSenderId: "240085089487",
  appId: "1:240085089487:web:e18821a8d60a10123b4bba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {
  app,
  collection,
  addDoc,
  setDoc,
  doc,
  db,
  deleteDoc ,
  serverTimestamp ,
  getDocs ,onSnapshot ,
  query, orderBy, limit,
  updateDoc ,

  
};