import CustomButton from "../../../../Components/Layouts/Shared/CustomButton";

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
        <CustomButton
          key={buttonLabel}
          buttonLabel={buttonLabel}
          bgColor={bgColor}
          onClick={() => handleSendNotification(message)}
        />
      ))}
    </div>
  );
}

export default ButtonGroup;
