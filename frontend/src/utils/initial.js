import { CGCheck, CGCheckKEY, CGExamine, CGExamineKEY, CGPutin, CGPutinKEY,Out,OutKEY,OutCheck,OutCheckKEY } from "../LocalStorage/Storagelist";
import { EMPLOYEEKEY,  EmployeesTables } from "../Mock/employeesMock";
import { InventoryDataTable, INVENTORYKEY, SUPPLIERSKEY, SupplierTable } from "../Mock/inventoryMock";
import {CATEGORYKEY,PRODUCTSKEY, ProductCategoryTable,} from "../Mock/productsMock";
import { getLocalStorage,setLocalStorage } from "./storageways";

export function initialCGcheck() {
    const isExists = getLocalStorage(CGCheckKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(CGCheckKEY,CGCheck , true)
    }
}
export function initialCGPutin() {
    const isExists = getLocalStorage(CGPutinKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(CGPutinKEY, CGPutin, true)
    }
}

export function initialCgExamine() {
    const isExists = getLocalStorage(CGExamineKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(PRODUCTSKEY, CGExamine, true)
    }
}


export function initialOutcheck() {
    const isExists = getLocalStorage(OutCheckKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(OutCheckKEY,OutCheck , true)
    }
}

export function initialOut() {
    const isExists = getLocalStorage(OutKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(OutKEY,Out , true)
    }
}
//员工信息初始化
export function initialEMPLOYEE() {
    const isExists = getLocalStorage(EMPLOYEEKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(EMPLOYEEKEY, EmployeesTables, true)
    }
}



//商品类型信息初始化
export function initialCATEGORY() {
    const isExists = getLocalStorage(CATEGORYKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(CATEGORYKEY,ProductCategoryTable, true)
    }
}

//库存信息初始化
export function initialINVENTORY (){
    const isExists = getLocalStorage(INVENTORYKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(INVENTORYKEY, InventoryDataTable, true)
    }
}

//供应商信息初始化
export function initialSUPPLIERS() {
    const isExists = getLocalStorage(SUPPLIERSKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(SUPPLIERSKEY, SupplierTable, true)
    }
}

