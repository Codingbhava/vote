import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-me_background">
      <img
          className='invert animate-pulse'
       width={100}
       height={100}
        alt="Loading..."
        src="/logo.png"
      />   
    </div>
  );
};

export default Loading;
