import React, { useState, useEffect } from 'react';

export const RealTimeClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // 每秒更新一次

    // 清理定时器
    return () => clearInterval(timerId);
  }, []);

  return (
    <div>
      {currentTime.toISOString().slice(0, 19)}
    </div>
  )
};


