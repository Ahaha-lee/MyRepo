import { isDeleteExpression } from "typescript";
import { CategoryAddModal } from "../views/Storage/Product/CategoryAdd";
import { InventoryList } from "../views/Storage/Inventory/InventoryList";

// api公用数据
export const BaseApi = {
    baseURL: "http://localhost:8081/api",
    register: "/users/register",
    login: "/users/login",
    addVip:"/vip",
    deletevip:"/vip/:delete_id",
    updatevip:"/vip/:update_id",
    searchvip:'/vip/:search_id',
    viplist:"/vip/list",

    procurementlst:"/storage/cg/:search_id/:page",//查询
    procurementupdate:"/storage/cg_declaration/:update_id",//修改采购申请表
    outdeclarationlist:"/storage/ck/:search_id/:page",
    inboundrecordslist:"/storage/cg/operate/:page",  //入库记录中未完成的的procurement
    outstoragelist:"/storage/ck/operate",   //出库记录中未完成的outdeclaration
    inboundrecords:"/storage/cg/records/:search_id/:page",  //纯纯的入库记录
    outboundrecords:"/storage/ck/records/:search_id/:page",//纯纯的出库记录
    status:"/storage/:action/record/status_:record_id/:page",
    cgsb:"/storage/cgsb",
    cgsh:"/storage/cg/sh/:update_id",
    cgrk:"/storage/cg/rk/:update_id",
    cgys:"/storage/cg/ys/:update_id",
    cksb:"/storage/cksb",
    cksh:"/storage/ck/sh/:update_id",
    ckck:"/storage/ck/ck/:update_id",

    productsearch:"/storage/product/:search_id/:page",// 查询商品
    addproduct:"/storage/product/insert",//添加商品信息
    deleteproduct:"/storage/product/:delete_id", //删除商品信息
    batchdeleteproduct:"/storage/product/batchdelete",//product批量删除
    updateprduct:"/storage/product/:update_id",

    categorysearch:"/storage/category/:search_id/:page" ,//查询类型
    categoryadd: "/storage/category/insert",

    inventorylist:"/storage/inventory/:search_id/:page",//商品库存信息查询
    inventoryupdate:"/storage/inventory/:update_id",
};
