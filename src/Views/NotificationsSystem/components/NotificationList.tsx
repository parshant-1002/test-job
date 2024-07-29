/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { STRINGS } from '../../../Shared/Constants';
import { FirestoreDocument } from '../../../hooks/useFirestoreCollection';

// Define the type for the props

interface NotificationListProps {
  notifications: FirestoreDocument[];
  markAsRead: (id: string) => void;
}

function NotificationList({
  notifications,
  markAsRead,
}: NotificationListProps) {
  return (
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
  );
}

export default NotificationList;
