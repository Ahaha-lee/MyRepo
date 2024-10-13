
import { useState } from 'react';

const useStoreState = () => {
    const [isOK, setIsOK] = useState(false); // 初始化 isOK 状态为 false

    // 切换 isSH 状态的函数
    const togglestate = () => {
        setIsOK(prev => !prev); // 切换状态
    };

    // 返回状态和操作函数
    return { isOK, setIsOK, togglestate };
};

export default useStoreState;
