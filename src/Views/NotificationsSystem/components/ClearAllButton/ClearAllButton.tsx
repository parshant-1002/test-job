interface ClearAllButtonProps {
  isLoading: boolean;
  error: string | null;
  onClick: () => void;
}

function ClearAllButton({ isLoading, error, onClick }: ClearAllButtonProps) {
  return (
    <div>
      <button
        type="button"
        className="bg-white text-black px-4 py-2"
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? 'Clearing...' : 'Clear All'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default ClearAllButton;
