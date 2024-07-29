/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { addDoc, collection } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db, requestPermission } from '../../../firebase.js';
import { FIREBASE_COLLECTION, STRINGS } from '../../Shared/Constants.js';
import updateFirestoreDocument from '../../Shared/Util.js';
import useFirestoreCollection from '../../hooks/useFirestoreCollection.js';
import buttonConfig from './helpers/constants.js';

function NotificationsSystem() {
  const [tokenData, setToken] = useState<string | null>('');
  const { documents: notifications } = useFirestoreCollection(
    FIREBASE_COLLECTION.NOTIFICATIONS
  );

  useEffect(() => {
    requestPermission().then((token) => setToken(token));
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
          'New Notification',
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
      <div className="flex justify-around gap-5">
        {buttonConfig?.map(({ buttonLabel, message, bgColor }) => (
          <button
            key={buttonLabel}
            type="button"
            className={`${bgColor} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded no-focus-outline`}
            onClick={() => handleSendNotification(message)}
          >
            {buttonLabel}
          </button>
        ))}
      </div>
      <ul className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            onClick={() => markAsRead(notification.id)}
            className={`p-4 cursor-pointer ${
              notification.read ? 'bg-gray-100' : 'bg-white'
            }`}
          >
            <div className="flex justify-between text-black">
              <span>{notification.message}</span>
              <span
                className={`text-sm ${
                  notification.read ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {notification.read ? STRINGS.READ : STRINGS.UNREAD}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationsSystem;
