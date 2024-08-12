import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBiQiSyULZQl41cy6VwgbzOFmpQKGecAWM",
  authDomain: "app-tech-26c13.firebaseapp.com",
  projectId: "app-tech-26c13",
  storageBucket: "app-tech-26c13.appspot.com",
  messagingSenderId: "714088114368",
  appId: "1:714088114368:web:6344aaedcdaa58e41e2525"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage }