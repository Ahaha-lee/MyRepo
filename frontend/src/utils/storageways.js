
export function getLocalStorage(key, isJson=false) {
    const value = localStorage.getItem(key);
    if (isJson && value) {
        try {
            // 解析Json字符
            const jsonValue = JSON.parse(value);
            return jsonValue;
        } catch (error) {
            console.error(`Error parsing JSON from localStorage for key "${key}":`, error);
            return null; // 或者返回一个默认值
        }
    }
    return value;
}


export function setLocalStorage(key, value, isJson=false) {
    if (isJson) {
        // 如果是 JSON，直接存储
        const jsonValue = JSON.stringify(value);
        localStorage.setItem(key, jsonValue);
    } else {
        // 否则，将值转换为 JSON 字符串
        localStorage.setItem(key, value);
    }
}


