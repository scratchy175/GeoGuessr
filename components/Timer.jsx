import React, { useEffect } from 'react';

const Timer = ({ timeLeft, resetTimer, onComplete }) => {
  useEffect(() => {
    if (timeLeft === 0) {
      onComplete();
      return;
    }

    const intervalId = setInterval(() => {
      resetTimer(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, resetTimer]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className='bg-black bg-opacity-70 py-1 px-5 rounded-full text-white text-base font-bold border-orange-200 border-2 absolute left-1/2 transform -translate-x-1/2'>
        
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
};

export default Timer;
