interface NotificationButtonProps {
  buttonLabel: string;
  message: string;
  bgColor: string;
  onClick: (message: string) => void;
}

function NotificationButton({
  buttonLabel,
  message,
  bgColor,
  onClick,
}: NotificationButtonProps) {
  return (
    <button
      type="button"
      className={`${bgColor} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded no-focus-outline`}
      onClick={() => onClick(message)}
    >
      {buttonLabel}
    </button>
  );
}

export default NotificationButton;
