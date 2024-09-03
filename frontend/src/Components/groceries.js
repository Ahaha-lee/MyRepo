import React, { useState, useEffect } from 'react';

export const RealTimeClock = ({ setCurrentTime }) => { // 接收 setCurrentTime 函数
  const [currentTime, setCurrentTimeState] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      const newTime = new Date();
      setCurrentTimeState(newTime);
      setCurrentTime && setCurrentTime(newTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })); // 更新父组件的时间
    }, 1000);

    return () => clearInterval(timerId);
  }, [setCurrentTime]);

  // 格式化为北京时间
  const formattedTime = currentTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

  return (
    <div>
      {formattedTime}
    </div>
  );
};
