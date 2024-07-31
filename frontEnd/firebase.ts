import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { STRINGS } from './src/Shared/Constants';
import { toast } from 'react-toastify';

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
export const getOrRegisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    return window.navigator.serviceWorker
      .getRegistration('/firebase-push-notification-scope')
      .then((serviceWorker) => {
        if (serviceWorker) return serviceWorker;
        return window.navigator.serviceWorker.register(
          '/firebase-messaging-sw.js',
          {
            scope: '/firebase-push-notification-scope',
          }
        );
      });
  }
  throw new Error('The browser doesn`t support service worker.');
};

const requestPermission = async (): Promise<string | null> => {
  try {
    // Register the service worker
    const registration = await getOrRegisterServiceWorker();
    if (!registration) {
      console.error(STRINGS.SERVICEWORKER_FAILED);
      toast.error(STRINGS.SERVICEWORKER_FAILED);
      return null;
    }

    // Request permission to send notifications
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log(STRINGS.TOKEN_RECEIVED, token);
      return token;
    }
    console.warn(STRINGS.NO_TOKEN_AVAILABLE);
    return null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(STRINGS.ERROR_GETTING_TOKEN, error.message);
      toast.error(`${STRINGS.ERROR_GETTING_TOKEN} ${error.message}`);
    } else {
      console.error(STRINGS.UNEXPECTED_ERROR, error);
      toast.error(`${STRINGS.UNEXPECTED_ERROR} ${error}`);
    }
    return null;
  }
};

export { auth, db, getToken, messaging, onMessage, requestPermission };
