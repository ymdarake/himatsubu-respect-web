import React from 'react';

interface XpBarProps {
  current: number;
  max: number;
  barColor?: string;
  className?: string;
}

const XpBar: React.FC<XpBarProps> = ({ current, max, barColor = 'bg-yellow-400', className = '' }) => {
  const percentage = max > 0 ? (current / max) * 100 : 0;

  return (
    <div className={`w-full bg-gray-700 rounded-full h-2.5 border-2 border-gray-500 overflow-hidden ${className}`}>
      <div
        className={`${barColor} h-full rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default XpBar;
