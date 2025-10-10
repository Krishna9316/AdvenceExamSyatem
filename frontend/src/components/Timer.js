// frontend/src/components/Timer.js
import React, { useState, useEffect } from 'react';

const Timer = ({ initialMinutes = 30, onTimeUp }) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setSeconds(seconds - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds, onTimeUp]);

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const timeColorClass = seconds < 300 ? 'text-red-500' : 'text-green-400';

  return (
    <div className={`fixed top-20 right-4 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl`}>
      <h2 className={`text-4xl font-mono font-bold ${timeColorClass}`}>{formatTime()}</h2>
      <p className="text-center text-gray-400">Time Remaining</p>
    </div>
  );
};

export default Timer;