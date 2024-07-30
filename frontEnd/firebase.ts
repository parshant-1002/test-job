import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import registerServiceWorker from './src/register-sw';

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

const requestPermission = async (): Promise<string | null> => {
  try {
    // Register the service worker
    const registration = await registerServiceWorker();
    if (!registration) {
      console.error('Service Worker registration failed.');
      return null;
    }

// Request permission to send notifications
const token = await getToken(messaging, {
  vapidKey,
  serviceWorkerRegistration: registration,
});

if (token) {
  console.log('Token received:', token);
  return token;
}
console.warn('No registration token available. Request permission to generate one.');
return null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error getting token:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
};

export { auth, db, getToken, messaging, onMessage, requestPermission };