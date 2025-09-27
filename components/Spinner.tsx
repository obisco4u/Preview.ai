
import React from 'react';

interface SpinnerProps {
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ className = 'w-6 h-6' }) => {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-solid border-white border-t-transparent ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
