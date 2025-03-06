import { Routes ,Route} from "react-router-dom";
import React from "react";
import {CGSBPage } from "../views/Storage/Caigou/CaiGouSB";
import { CKSBPage } from "../views/Storage/Chuku/OutSB";
import {AllOutDecalarationDetailsPage} from "../views/Storage/Chuku/OutListPro";
import { CaiGouOpertionPage } from "../views/Storage/Caigou/CaiGouOperation";
import { OutOpertionPage } from "../views/Storage/Chuku/OutOperation";
import { AllProcurementDetailsPage } from "../views/Storage/Caigou/CaiGouListPro";
import { GetCacheProductPage, ProductListPage } from "../views/Storage/Product/ProductList";
import { ProductAddPage, ProductBatchAddPage, ProductUpdatePage } from "../views/Storage/Product/ProductOperation";
import { CategoryListPage } from "../views/Storage/Product/CategotyList";
import { InventoryUpdatePage } from "../views/Storage/Inventory/InventoryOperation";
import { InventoryListPage } from "../views/Storage/Inventory/InventoryList";
import { ProcurementUpdatePage } from "../views/Storage/Caigou/CaiGouSB";
export function StorageRouter(){
    return (
        <div>
        <Routes>
        {/* 商品列表 */}
        <Route path="/productlist" element={<ProductListPage/>} />

        <Route path="/product_add" element={< ProductAddPage/>} />ff
        <Route path="/product_batchadd" element={<ProductBatchAddPage/>} />
        <Route path="/product_update" element={<ProductUpdatePage/>} />
        <Route path="/product_hot" element={<GetCacheProductPage/>}/>

        {/* 商品类型列表 */}
        <Route path="/categorylist" element={<CategoryListPage/>} />

        <Route path="/inventory_update" element={<InventoryUpdatePage/>} />

        
        {/* 记录 */}
        <Route path="/cginfo" element={<AllProcurementDetailsPage/>}/>
        {/* 采购申请 */}
            <Route path="/cgsb" element={<CGSBPage/>}/>

            <Route path="/cg_declaration/update" element={<ProcurementUpdatePage/>}/>
        {/* 采购操作 */}
            <Route path="/cgoperation" element={<CaiGouOpertionPage/>}  />

         {/* 出库操作 */}
            <Route path="/ckoperation" element={<OutOpertionPage/>}  /> 
        {/* 出库申请记录 */}
            <Route path="/ckinfo" element={<AllOutDecalarationDetailsPage/>}/>
        {/* 出库申请 */}
        <Route path="/cksb" element={<CKSBPage/>}/> 


        <Route path="/inventorylist" element={<InventoryListPage/>}/>
        
        </Routes>
        </div>
    );
}



