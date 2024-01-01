// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD05GmMfLrdijRcxF5puX6fIHRmpNAIiMw",
  authDomain: "creator-37637.firebaseapp.com",
  projectId: "creator-37637",
  storageBucket: "creator-37637.appspot.com",
  messagingSenderId: "678431549537",
  appId: "1:678431549537:web:4b1180899fe41fbbb82220",
  measurementId: "G-6GZ9M5S0LH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

async function getCities(db) {
    const citiesCol = collection(db, 'cities');
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map(doc => doc.data());
    return cityList;
  }
