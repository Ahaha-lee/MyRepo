import { EMPLOYEEKEY,  EmployeesTables } from "../Mock/employeesMock";
import { InventoryDataTable, INVENTORYKEY, SUPPLIERSKEY, SupplierTable } from "../Mock/inventoryMock";
import { VIPKEY, VIPDataTable} from "../Mock/mock";
import {CATEGORYKEY,PRODUCTSKEY, ProductCategoryTable, ProductsDataTable} from "../Mock/productsMock";
import { getLocalStorage,setLocalStorage } from "./storageways";

export function initialVIP() {
    const isVIPExists = getLocalStorage(VIPKEY, true)
    if (!isVIPExists&&localStorage.getItem('session')) {
        setLocalStorage(VIPKEY, VIPDataTable , true)
    }
}

//员工信息初始化
export function initialEMPLOYEE() {
    const isExists = getLocalStorage(EMPLOYEEKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(EMPLOYEEKEY, EmployeesTables, true)
    }
}

//所有商品信息初始化
export function initialPRODUCTS() {
    const isExists = getLocalStorage(PRODUCTSKEY, true)
    if (!isExists&&localStorage.getItem('session')) {
        setLocalStorage(PRODUCTSKEY, ProductsDataTable, true)
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

