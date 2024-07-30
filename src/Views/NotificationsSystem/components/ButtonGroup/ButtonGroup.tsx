import NotificationButton from '../NotificationButton';

interface ButtonConfig {
  buttonLabel: string;
  message: string;
  bgColor: string;
}

interface ButtonGroupProps {
  buttonConfig: ButtonConfig[];
  handleSendNotification: (message: string) => void;
}

function ButtonGroup({
  buttonConfig,
  handleSendNotification,
}: ButtonGroupProps) {
  return (
    <div className="flex justify-around gap-5">
      {buttonConfig?.map(({ buttonLabel, message, bgColor }) => (
        <NotificationButton
          key={buttonLabel}
          buttonLabel={buttonLabel}
          message={message}
          bgColor={bgColor}
          onClick={handleSendNotification}
        />
      ))}
    </div>
  );
}

export default ButtonGroup;
