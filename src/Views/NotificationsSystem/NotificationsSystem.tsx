/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  db,
  messaging,
  onMessage,
  requestPermission,
} from '../../../firebase.js';
import ToastifyNotification from '../../Components/Layouts/Public/ToastifyNotification/ToastifyNotification.js';
import { useSendNotificationMutation } from '../../Services/Api/module/notification/index.js';
import { FIREBASE_COLLECTION, STRINGS } from '../../Shared/Constants.js';
import UTILS from '../../Shared/Util.js';
import useFirestoreCollection from '../../hooks/useFirestoreCollection.js';
import buttonConfig from './helpers/constants.js';
import ButtonGroup from './components/ButtonGroup/ButtonGroup.js';
import ClearAllButton from './components/ClearAllButton/ClearAllButton.js';
import NotificationList from './components/NotificationList/NotificationList.js';

function NotificationsSystem() {
  const [tokenData, setToken] = useState<string | null>('');
  const [error, setError] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sendNotification] = useSendNotificationMutation();
  const { documents: notifications } = useFirestoreCollection(
    FIREBASE_COLLECTION.NOTIFICATIONS
  );

  const markAsRead = async (id: string) => {
    const updateData = { read: true };
    await UTILS.updateFirestoreDocument(
      FIREBASE_COLLECTION.NOTIFICATIONS,
      id,
      updateData
    );
  };

  const handleSendNotification = async (message: string) => {
    try {
      if (tokenData) {
        // added doc foras initial to set notification status unseen
        const docRef = await addDoc(
          collection(db, FIREBASE_COLLECTION.NOTIFICATIONS),
          {
            message,
            read: false,
            createdAt: serverTimestamp(),
          }
        );
        const docId = docRef.id;

        // triggerred notification for the button clicked
        await sendNotification({
          deviceToken: tokenData,
          message,
          notificationId: docId,
        }).unwrap();
      }
      console.log(STRINGS.NOTIFICATION_SENT.SUCCESS);
    } catch (err) {
      console.error(STRINGS.NOTIFICATION_SENT.FAILURE, err);
    }
  };

  const handleClearCollection = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await UTILS.clearFirestoreCollection(FIREBASE_COLLECTION.NOTIFICATIONS);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(STRINGS.ERROR_UNKNOWN);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickToast = useCallback(
    (notificationId: string, toastId: string | number) => {
      markAsRead(notificationId);
      toast.dismiss(toastId);
    },
    []
  );

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      const { notification } = payload;
      if (notification) {
        const { title, body } = notification;
        const message = JSON.parse(body || '');
        const toastId = toast(
          <ToastifyNotification
            title={title}
            body={message.body}
            onClick={() => {
              handleClickToast(message.notificationId, toastId);
            }}
          />
        );
      }
    });
    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, [handleClickToast]);

  useEffect(() => {
    requestPermission().then((token) => setToken(token));
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-center text-black">
        {STRINGS.NOTIFICATION_SYSTEM}
      </h1>
      <ButtonGroup
        buttonConfig={buttonConfig}
        handleSendNotification={handleSendNotification}
      />
      {notifications?.length ? (
        <ClearAllButton
          isLoading={isLoading}
          error={error}
          onClick={handleClearCollection}
        />
      ) : null}
      <NotificationList notifications={notifications} markAsRead={markAsRead} />
    </div>
  );
}

export default NotificationsSystem;
