import React, { useState, useEffect } from 'react';

interface TouchControlsProps {
  onPointerDown: (direction: 'left' | 'right') => void;
  onPointerUp: () => void;
  onAction: () => void;
  actionVisible: boolean;
}

const TouchControls: React.FC<TouchControlsProps> = ({ onPointerDown, onPointerUp, onAction, actionVisible }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showIndicator, setShowIndicator] = useState(true);

  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);

    if (hasTouch) {
        // This timer will remove the indicators after the animation is complete.
        const timer = setTimeout(() => {
          setShowIndicator(false);
        }, 2500); // Must match the animation duration

        return () => clearTimeout(timer);
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, direction: 'left' | 'right') => {
    e.preventDefault();
    (e.target as HTMLDivElement).setPointerCapture(e.pointerId);
    onPointerDown(direction);
  };
  
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.target as HTMLDivElement).releasePointerCapture(e.pointerId);
    onPointerUp();
  };

  if (!isTouchDevice) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes fade-out-indicator {
            0% { opacity: 0.3; }
            60% { opacity: 0.3; } /* Hold for 1.5s */
            100% { opacity: 0; }   /* Fade out for 1s */
        }
        .animate-fade-out-indicator {
            animation: fade-out-indicator 2.5s ease-in-out forwards;
        }

        @keyframes fade-out-arrow {
            0% { opacity: 0.5; }
            60% { opacity: 0.5; }
            100% { opacity: 0; }
        }
        .animate-fade-out-arrow {
            animation: fade-out-arrow 2.5s ease-in-out forwards;
        }
      `}</style>
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full flex pointer-events-auto" style={{ height: '33vh' }}>
          {/* Left half for moving left */}
          <div
              className="w-1/2 h-full relative"
              onPointerDown={(e) => handlePointerDown(e, 'left')}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              aria-label="Move Left"
          >
              {showIndicator && (
                  <>
                      <div className="absolute inset-0 bg-white animate-fade-out-indicator" />
                      <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-mono select-none animate-fade-out-arrow">
                          ‹
                      </div>
                  </>
              )}
          </div>
          {/* Right half for moving right */}
          <div
              className="w-1/2 h-full relative"
              onPointerDown={(e) => handlePointerDown(e, 'right')}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              aria-label="Move Right"
          >
              {showIndicator && (
                  <>
                      <div className="absolute inset-0 bg-white animate-fade-out-indicator" />
                      <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-mono select-none animate-fade-out-arrow">
                          ›
                      </div>
                  </>
              )}
          </div>
        </div>

        {/* Action Control */}
        {actionVisible && (
          <div className="absolute bottom-5 right-5 pointer-events-auto">
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
    </>
  );
};

export default TouchControls;