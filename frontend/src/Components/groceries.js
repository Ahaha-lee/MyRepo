import React, { useState, useEffect } from 'react';

export const RealTimeClock = ({ setCurrentTime }) => {
  const [currentTime, setCurrentTimeState] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      const newTime = new Date();
      setCurrentTimeState(newTime);

      // 将时间转换为北京时间
      const beijingTime = new Date(newTime.getTime() + (newTime.getTimezoneOffset() * 60000));
      const isoTime = beijingTime.toISOString();
      setCurrentTime && setCurrentTime(isoTime); // 更新父组件的时间
    }, 1000);

    return () => clearInterval(timerId);
  }, [setCurrentTime]);

  return (
    <div>
      {currentTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
    </div>
  );
};
