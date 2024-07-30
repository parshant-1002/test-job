importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore-compat.js');

// Initialize Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyDWRQj36wA0rQVWsWdmkduwYsDVcKsDnsw',
  authDomain: 'test-job-cffa2.firebaseapp.com',
  projectId: 'test-job-cffa2',
  storageBucket: 'test-job-cffa2.appspot.com',
  messagingSenderId: '999736974361',
  appId: '1:999736974361:web:d7482aadf1e52806111e88',
  measurementId: 'G-5RZSGVJFP1',
});

const messaging = firebase.messaging();
const firestore = firebase.firestore();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'No Title';
  const notificationOptions = {
    body: payload.notification?.body || 'No Body',
    data: { notificationId: payload.data?.notificationId }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  console.log("🚀 ~ self.addEventListener ~ notificationId:", notificationId)
  event.notification.close();
  const notificationId = event.notification?.data?.notificationId;

  if (notificationId) {
    // Update Firestore directly from the service worker
    const notificationRef = firestore.collection('notifications').doc(notificationId);
    notificationRef.update({ read: true })
      .then(() => {
        console.log('Notification marked as read');
      })
      .catch((error) => {
        console.error('Error marking notification as read:', error);
      });
  }
});
