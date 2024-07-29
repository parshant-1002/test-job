import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const messaging = getMessaging(app);
const isUseEmulators = import.meta.env.VITE_APP_CONNECT_WITH_EMULATORS;
const vapidKey = import.meta.env.VITE_VAPID_KEY;

if (window.location.hostname === 'localhost' && isUseEmulators === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
}

const requestPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey,
    });
    if (token) {
      console.log('Token received:', token);
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};
export { auth, db, getToken, messaging, onMessage, requestPermission };
