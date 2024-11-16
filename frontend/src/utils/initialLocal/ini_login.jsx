import { getLocalStorage, setLocalStorage  } from "../localstorage";
export const AccountData= {
    name:'',
    Password:'',
};
//登录页面初始化localstorage key=session
export function initialSession() {
    const isExists = getLocalStorage('session', true)
    if (!isExists) {
        setLocalStorage('session',AccountData, true)
    }
}