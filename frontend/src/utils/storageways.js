
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

export function AddnewValue(data, key) {
    const existingData = getLocalStorage(key, true) || [];
    existingData.push(data);
    setLocalStorage(key, existingData, true);
}

export function GetLatestid(key) {
    const oldData = getLocalStorage(key, true); // 获取数据
    if (oldData && Array.isArray(oldData)) { // 检查 oldData 是否存在且是数组
        return oldData.length; // 返回数组的长度
    }
    return 0; // 如果 oldData 为 null 或不是数组，返回 0
}

export function DeleteData(index,quantity,key){
    const deleData = getLocalStorage(key,true)||[];
    deleData.splice(index,quantity);
    setLocalStorage(key,deleData,true)

}