import {  AGREECGSBKEY, ALLINVENTORY, CAIGOUSB, CAIGOUSBKEY, INVENTORYKEY, SUPPLIERS, SUPPLIERSKEY } from "../Mock/inventoryMock";
import { VIPKEY ,INITIAL_VIP} from "../Mock/mock";
import { ALLPRODUCTS,CATEGORYKEY,PRODUCTSKEY ,PRODUCT_CATEGORIES} from "../Mock/productsMock";
import { getLocalStorage,setLocalStorage } from "./storageways";

export function initialVIP() {
    const isVIPExists = getLocalStorage(VIPKEY, true)
    if (!isVIPExists&&localStorage.getItem('session')) {
        setLocalStorage(VIPKEY, INITIAL_VIP , true)
    }
}

//所有商品信息初始化
export function initialPRODUCTS() {
    const isVIPExists = getLocalStorage(PRODUCTSKEY, true)
    if (!isVIPExists&&localStorage.getItem('session')) {
        setLocalStorage(PRODUCTSKEY, ALLPRODUCTS, true)
    }
}

//商品类型信息初始化
export function initialCATEGORY() {
    const isVIPExists = getLocalStorage(CATEGORYKEY, true)
    if (!isVIPExists&&localStorage.getItem('session')) {
        setLocalStorage(CATEGORYKEY, PRODUCT_CATEGORIES, true)
    }
}

//库存信息初始化
export function initialINVENTORY (){
    const isVIPExists = getLocalStorage(INVENTORYKEY, true)
    if (!isVIPExists&&localStorage.getItem('session')) {
        setLocalStorage(INVENTORYKEY, ALLINVENTORY, true)
    }
}

//供应商信息初始化
export function initialSUPPLIERS() {
    const isVIPExists = getLocalStorage(SUPPLIERSKEY, true)
    if (!isVIPExists&&localStorage.getItem('session')) {
        setLocalStorage(SUPPLIERSKEY, SUPPLIERS, true)
    }
}

//采购申报表初始化
export function initialCAIGOUSB() {
    const isVIPExists = getLocalStorage(CAIGOUSBKEY, true)
    if (!isVIPExists&&localStorage.getItem('session')) {
        setLocalStorage(CAIGOUSBKEY, CAIGOUSB, true)
    }
}

//审核成功采购信息初始化
export function initialAGREECGSB() {
    const isVIPExists = getLocalStorage(AGREECGSBKEY, true)
    if (!isVIPExists&&localStorage.getItem('session')) {
        setLocalStorage(AGREECGSBKEY,CAIGOUSB, true)
    }
}