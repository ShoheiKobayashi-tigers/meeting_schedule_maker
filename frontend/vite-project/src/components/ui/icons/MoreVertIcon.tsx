import React from 'react';

interface IconProps {
  className?: string;
}

export const MoreVertIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="5.5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="18.5" r="2" />
    </svg>
  );
};