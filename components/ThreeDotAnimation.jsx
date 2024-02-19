import React, { useState, useEffect } from 'react';

const ThreeDotAnimation = ({ text }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        const newDots = prevDots === '...' ? '' : `${prevDots}.`;
        return newDots;
      });
    }, 150); // Adjust the interval as needed

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <p>{text}{dots}</p>
    </div>
  );
};

export default ThreeDotAnimation;
