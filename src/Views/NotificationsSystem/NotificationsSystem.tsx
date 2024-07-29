/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { addDoc, collection } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db, requestPermission } from '../../../firebase.js';
import { FIREBASE_COLLECTION, STRINGS } from '../../Shared/Constants.js';
import updateFirestoreDocument from '../../Shared/Util.js';
import useFirestoreCollection from '../../hooks/useFirestoreCollection.js';
import buttonConfig from './helpers/constants.js';
import ButtonGroup from './components/ButtonGroup.js';
import NotificationList from './components/NotificationList.js';

function NotificationsSystem() {
  const [tokenData, setToken] = useState<string | null>('');
  const { documents: notifications } = useFirestoreCollection(
    FIREBASE_COLLECTION.NOTIFICATIONS
  );

  useEffect(() => {
    requestPermission()
      .then((token) => setToken(token))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const markAsRead = async (id: string) => {
    const updateData = { read: true };
    await updateFirestoreDocument(
      FIREBASE_COLLECTION.NOTIFICATIONS,
      id,
      updateData
    );
  };

  const handleSendNotification = async (message: string) => {
    try {
      if (tokenData) {
        const notificationRef = await addDoc(
          collection(db, FIREBASE_COLLECTION.NOTIFICATIONS),
          {
            message,
            read: false,
          }
        );
        const notificationId = notificationRef.id;

        const notificationOptions = {
          body: message,
          data: { notificationId },
        };
        const notification = new Notification(
          STRINGS.NEW_NOTIFICATION,
          notificationOptions
        );

        notification.onclick = () => {
          markAsRead(notificationId);
        };
      }
      console.log(STRINGS.NOTIFICATION_SENT.SUCCESS);
    } catch (err) {
      console.error(STRINGS.NOTIFICATION_SENT.FAILURE, err);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-center text-black">
        {STRINGS.NOTIFICATION_SYSTEM}
      </h1>
      <ButtonGroup
        buttonConfig={buttonConfig}
        handleSendNotification={handleSendNotification}
      />
      <NotificationList notifications={notifications} markAsRead={markAsRead} />
    </div>
  );
}

export default NotificationsSystem;
