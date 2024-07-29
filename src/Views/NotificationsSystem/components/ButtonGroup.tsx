// Define the type for the props
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
  );
}

export default ButtonGroup;
