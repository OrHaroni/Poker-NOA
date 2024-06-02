import React, { useState, useEffect } from 'react';
import './Timer.css'; // Ensure you have the CSS for styling

const Timer = () => {
  const [seconds, setSeconds] = useState(20);

  useEffect(() => {
    // Only set up the interval if seconds > 0
    if (seconds > 0) {
      const interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);

      // Cleanup the interval on component unmount or when seconds reach 0
      return () => clearInterval(interval);
    }
  }, [seconds]); // Dependency array includes `seconds`

  // Formatting the timer
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="timer-container">
      <div className="timer">
        {formatTime(seconds)}
      </div>
    </div>
  );
};

export default Timer;
