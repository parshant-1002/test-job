interface CustomButtonProps {
  buttonLabel: string;
  bgColor?: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

function CustomButton({
  buttonLabel,
  bgColor,
  onClick,
  className,
  disabled,
}: CustomButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={
        className
          ? className
          : `${bgColor} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded no-focus-outline`
      }
      onClick={onClick}
    >
      {buttonLabel}
    </button>
  );
}

export default CustomButton;
