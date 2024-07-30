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
import CustomButton from '../../Components/Layouts/Shared/CustomButton/CustomButton.js';
import { useSendNotificationMutation } from '../../Services/Api/module/notification/index.js';
import { FIREBASE_COLLECTION, STRINGS } from '../../Shared/Constants.js';
import UTILS from '../../Shared/Util.js';
import useFirestoreCollection from '../../hooks/useFirestoreCollection.js';
import ButtonGroup from './components/ButtonGroup/ButtonGroup.js';
import NotificationList from './components/NotificationList/NotificationList.js';
import buttonConfig from './helpers/constants.js';

function NotificationsSystem() {
  const [tokenData, setToken] = useState<string | null>('');
  const [error, setError] = useState<string | null>('');
  const [allowNotification, setAllowNotification] = useState<boolean>(false);
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
      } else {
        requestPermission().then((token) => setToken(token));
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
    const requestWithRetry = async () => {
      try {
        const permission = Notification.permission;
        if (permission !== 'granted') setAllowNotification(true);
        let token = await requestPermission();
        if (token) {
          setToken(token);
          setAllowNotification(false);
        }
      } catch (error) {
        console.error('Error requesting permission:', error);
      }
    };

    requestWithRetry();
  }, []);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      {tokenData ? (
        <>
          <h1 className="text-2xl font-bold text-center text-black">
            {STRINGS.NOTIFICATION_SYSTEM}
          </h1>
          <ButtonGroup
            buttonConfig={buttonConfig}
            handleSendNotification={handleSendNotification}
          />
          {notifications?.length ? (
            <>
              <CustomButton
                buttonLabel={isLoading ? 'Clearing...' : 'Clear All'}
                className="bg-white text-black px-4 py-2"
                onClick={handleClearCollection}
                disabled={isLoading}
              />
              {error && <p className="text-red-500">{error}</p>}
            </>
          ) : null}
          <NotificationList
            notifications={notifications}
            markAsRead={markAsRead}
          />
        </>
      ) : (
        <div className="text-black py-20 px-10 text-[30px]">
          {allowNotification ? 'Waiting for token...' : null}
        </div>
      )}
    </div>
  );
}

export default NotificationsSystem;
