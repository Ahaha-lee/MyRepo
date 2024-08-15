import { VIPKEY } from "../mock";
import { getLocalStorage, setLocalStorage } from "./storageways";


export function changeVIP(id, newValue) {
    const vips = getLocalStorage(VIPKEY, true);
    for (let i = 0; i < vips.length; i++) {
        if (vips[i].id === id) {
            vips[i] = newValue;
            break;
        }
    }
    setLocalStorage(VIPKEY, vips, true);
}