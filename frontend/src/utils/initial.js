import { EMPLOYEEKEY, EMPLOYEES } from "../Mock/employeesMock";
import {   ALLINVENTORY, CAIGOUToExsited, CAIGOUToNOTExisted, CGEXISTEDKEY, CGNOTEXISTEDKEY, INVENTORYKEY, SUPPLIERS, SUPPLIERSKEY } from "../Mock/inventoryMock";
import { VIPKEY ,INITIAL_VIP} from "../Mock/mock";
import { ALLPRODUCTS,CATEGORYKEY,PRODUCTSKEY ,PRODUCT_CATEGORIES} from "../Mock/productsMock";
import { getLocalStorage,setLocalStorage } from "./storageways";

export function initialVIP() {
    const isVIPExists = getLocalStorage(VIPKEY, true)
    if (!isVIPExists&&localStorage.getItem('session')) {
        setLocalStorage(VIPKEY, INITIAL_VIP , true)
    }
}

//员工信息初始化
export function initialEMPLOYEE() {
    const isExists = getLocalStorage(EMPLOYEEKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(EMPLOYEEKEY, EMPLOYEES, true)
    }
}

//所有商品信息初始化
export function initialPRODUCTS() {
    const isExists = getLocalStorage(PRODUCTSKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(PRODUCTSKEY, ALLPRODUCTS, true)
    }
}

//商品类型信息初始化
export function initialCATEGORY() {
    const isExists = getLocalStorage(CATEGORYKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(CATEGORYKEY, PRODUCT_CATEGORIES, true)
    }
}

//库存信息初始化
export function initialINVENTORY (){
    const isExists = getLocalStorage(INVENTORYKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(INVENTORYKEY, ALLINVENTORY, true)
    }
}

//供应商信息初始化
export function initialSUPPLIERS() {
    const isExists = getLocalStorage(SUPPLIERSKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(SUPPLIERSKEY, SUPPLIERS, true)
    }
}

//采购申报表初始化
export function initialCAIGOUTOEXI() {
    const isExists = getLocalStorage(CGEXISTEDKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(CGEXISTEDKEY,CAIGOUToExsited, true)
    }
}

//审核成功采购信息初始化
export function initialCAIGOUTONOTEXI() {
    const isExists = getLocalStorage(CGNOTEXISTEDKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(CGNOTEXISTEDKEY,CAIGOUToNOTExisted, true)
    }
}