
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import { getFirestore, collection, addDoc, setDoc ,doc , deleteDoc  ,serverTimestamp ,getDocs ,onSnapshot,  query, orderBy, limit ,updateDoc   } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


const firebaseConfig = {

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