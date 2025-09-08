import React, { useState, useEffect } from 'react';

interface TouchControlsProps {
  onPointerDown: (direction: 'left' | 'right') => void;
  onPointerUp: () => void;
  onAction: () => void;
  actionVisible: boolean;
}

const TouchControls: React.FC<TouchControlsProps> = ({ onPointerDown, onPointerUp, onAction, actionVisible }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>, direction: 'left' | 'right') => {
    e.preventDefault();
    (e.target as HTMLButtonElement).setPointerCapture(e.pointerId);
    onPointerDown(direction);
  };
  
  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    (e.target as HTMLButtonElement).releasePointerCapture(e.pointerId);
    onPointerUp();
  };

  const buttonStyle = "w-16 h-16 bg-gray-600 bg-opacity-50 rounded-full flex items-center justify-center text-white text-3xl font-bold active:bg-opacity-75 select-none";

  if (!isTouchDevice) {
    return null;
  }

  return (
    <div>
      {/* Movement Controls */}
      <div className="absolute bottom-5 left-5 z-20 flex gap-4">
        <button
          className={buttonStyle}
          onPointerDown={(e) => handlePointerDown(e, 'left')}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp} // Handle cases where touch is interrupted
          aria-label="Move Left"
        >
          &larr;
        </button>
        <button
          className={buttonStyle}
          onPointerDown={(e) => handlePointerDown(e, 'right')}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          aria-label="Move Right"
        >
          &rarr;
        </button>
      </div>

      {/* Action Control */}
      {actionVisible && (
        <div className="absolute bottom-5 right-5 z-20">
          <button
            className={`${buttonStyle} w-20 h-20 bg-yellow-500`}
            onClick={onAction}
            aria-label="Action"
          >
            ！
          </button>
        </div>
      )}
    </div>
  );
};

export default TouchControls;