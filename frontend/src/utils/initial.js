import { VIPKEY ,INITIAL_VIP, PRODUCTSKEY, PRODUCTS} from "../mock";
import { getLocalStorage,setLocalStorage } from "./storageways";
import pinyin from "pinyin";

export function initialVIP() {
    const isVIPExists = getLocalStorage(VIPKEY, true)
    if (!isVIPExists&&localStorage.getItem('session')) {
        setLocalStorage(VIPKEY, INITIAL_VIP , true)
    }
}


export function initialProducts(){
    const isProductsExists = getLocalStorage(PRODUCTSKEY,true)
    if(!isProductsExists&&localStorage.getItem('session')){
        setLocalStorage(PRODUCTSKEY,PRODUCTS,true)
    }
}


