import React from 'react';

type ProgressCircularProps = {
  isVisible: boolean;
};

export const ProgressCircular: React.FC<ProgressCircularProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center'>
      <div className='animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent'></div>
    </div>
  );
};
