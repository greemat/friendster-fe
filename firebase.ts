import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config object from the console
const firebaseConfig = {
  apiKey: "AIzaSyCq2Y8itsEu44n4OZph31D2YGuOKNm9A_A",
  authDomain: "reactnativedemo-d8272.firebaseapp.com",
  projectId: "reactnativedemo-d8272",
  storageBucket: "reactnativedemo-d8272.firebasestorage.app",
  messagingSenderId: "139117127529",
  appId: "1:139117127529:web:49f61f885b951d150f3ff8",
  measurementId: "G-YE8S9TQ3D1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

