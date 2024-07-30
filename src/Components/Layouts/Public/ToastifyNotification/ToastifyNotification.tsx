/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
// Define the type for the component props
interface ToastifyNotificationProps {
  title: string | undefined;
  body: string | undefined;
  onClick: () => void;
}

// Define the functional component
function ToastifyNotification({
  title,
  body,
  onClick,
}: ToastifyNotificationProps) {
  return (
    <div className="push-notification" onClick={onClick}>
      <h2 className="push-notification-title">{title}</h2>
      <p className="push-notification-text">{body}</p>
    </div>
  );
}

export default ToastifyNotification;
