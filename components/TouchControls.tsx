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
    // Check if the device supports touch events
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

  if (!isTouchDevice) {
    return null;
  }

  return (
    // The main container covers the entire parent (game view area)
    <div className="absolute inset-0 z-20">
      {/* Movement touch area */}
      <div className="absolute inset-0 flex">
        {/* Left half for moving left */}
        <button 
            className="w-1/2 h-full"
            onPointerDown={(e) => handlePointerDown(e, 'left')}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            aria-label="Move Left"
        />
        {/* Right half for moving right */}
        <button 
            className="w-1/2 h-full"
            onPointerDown={(e) => handlePointerDown(e, 'right')}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            aria-label="Move Right"
        />
      </div>

      {/* Action Control */}
      {actionVisible && (
        <div className="absolute bottom-5 right-5">
          <button
            className="w-20 h-20 bg-yellow-500 bg-opacity-70 rounded-full flex items-center justify-center text-white text-3xl font-bold active:bg-opacity-90 select-none"
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
