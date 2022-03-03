// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB23Dxwar11ixpDQyDWjpsgOWRDeHsLbsw',
  authDomain: 'house-marketplace-app-598a1.firebaseapp.com',
  projectId: 'house-marketplace-app-598a1',
  storageBucket: 'house-marketplace-app-598a1.appspot.com',
  messagingSenderId: '691680302407',
  appId: '1:691680302407:web:2a8e24762f38d6daf82862',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
