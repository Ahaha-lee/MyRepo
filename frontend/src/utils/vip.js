import { VIPKEY } from "../Mock/mock";
import { getLocalStorage, setLocalStorage } from "./storageways";


export function changeVIP(id, addPoints) {
    const vips = getLocalStorage(VIPKEY, true);
    const updatedVips = vips.map(vip => 
        vip.vip_id === id ? { ...vip, nowpoints: vip.nowpoints + addPoints } : vip
    );
    setLocalStorage(VIPKEY, updatedVips, true);
}


export function GetLastVIP(){
    const oldVip = getLocalStorage(VIPKEY,true)
    if(oldVip){
       const lastMemberid= oldVip.length;
       return lastMemberid;
    } 
}
