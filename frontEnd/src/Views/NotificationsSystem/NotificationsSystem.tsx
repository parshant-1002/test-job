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
import {
  FIREBASE_COLLECTION,
  NOTIFICATION_STATUS,
  STRINGS,
} from '../../Shared/Constants.js';
import UTILS from '../../Shared/Util.js';
import useFirestoreCollection from '../../hooks/useFirestoreCollection.js';
import ButtonGroup from './components/ButtonGroup/ButtonGroup.js';
import NotificationList from './components/NotificationList/NotificationList.js';
import buttonConfig from './helpers/constants.js';
import { useDispatch, useSelector } from 'react-redux';
import { updatDeviceTokenRedux } from '../../Store/Common/index.js';
import { RootState } from '../../Store/index.js';

function NotificationsSystem() {
  const dispatch = useDispatch();
  const tokenData = useSelector(
    (state: RootState) => state?.common?.deviceToken
  );
  const [error, setError] = useState<string | null>('');
  const [waitingForToken, setWaitingForToken] = useState<boolean>(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(
    Notification.permission === NOTIFICATION_STATUS.DEFAULT
  );

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
      if (
        showNotificationBanner ||
        !tokenData ||
        Notification.permission !== NOTIFICATION_STATUS.GRANTED
      )
        return toast.error(STRINGS.ALLOW_NOTIFICATION_PERMISSION);
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

  const handleNotificationRequest = async ({
    isShowBanner,
  }: {
    isShowBanner?: boolean;
  } = {}) => {
    setShowNotificationBanner(false);
    try {
      if (isShowBanner) {
        setWaitingForToken(true);
      }
      let token = await requestPermission();
      if (token) {
        dispatch(updatDeviceTokenRedux(token));
        setWaitingForToken(false);
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  useEffect(() => {
    if (
      Notification.permission === NOTIFICATION_STATUS.DEFAULT ||
      Notification.permission === NOTIFICATION_STATUS.DENIED
    ) {
      dispatch(updatDeviceTokenRedux(null));
    }
  }, []);
  return (
    <>
      {showNotificationBanner ? (
        <div className="bg-gray-200 text-black py-4 px-6 text-lg fixed top-0 left-0 w-full z-50">
          <div className="flex items-center justify-between">
            <span className="mr-4">
              {STRINGS.APP_NEED_PERMISSION}{' '}
              <a
                href="#"
                className="text-blue-500 hover:underline"
                onClick={() =>
                  handleNotificationRequest({ isShowBanner: true })
                }
              >
                {STRINGS.ENABLE_PUSH_NOTIFICATION}
              </a>
            </span>
          </div>
        </div>
      ) : null}
      {waitingForToken ? (
        <div className="bg-gray-200 text-black py-4 px-6 text-lg fixed top-0 left-0 w-full z-50">
          <div className="flex items-center justify-between">
            <span className="mr-4">{STRINGS.WAITING_TOKEN}</span>
          </div>
        </div>
      ) : null}

      <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
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
      </div>
    </>
  );
}

export default NotificationsSystem;
