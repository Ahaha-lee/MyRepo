import { permission } from "process";
import { preload } from "react-dom";

// api公用数据
export const BaseApi = {
    baseURL: "http://localhost:8081/api",
    register: "/users/register",
    login: "/users/login",
    addVip:"/vip/insert",
    deletevip:"/vip/:delete_id",
    updatevip:"/vip/:update_id",
    viplist:"/vip/:search_id/:page",

    vipgraderule:"/vip_grades/insert",
    getgradeinfo:"/vip_grades/getinfo",

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
    hotproduct:"/storage/product/hot/:search_id",//cache
    preload:"/storage/product/hot/preload",
    getcacheallinfo:"/storage/product/hot/all",
    addproduct:"/storage/product/insert",//添加商品信息
    deleteproduct:"/storage/product/:delete_id", //删除商品信息
    batchdeleteproduct:"/storage/product/batchdelete",//product批量删除
    updateprduct:"/storage/product/:update_id",

    categorysearch:"/storage/category/:search_id/:page" ,//查询类型
    categoryadd: "/storage/category/insert",
    categorydelete:"/storage/catrgoey/:delete_id",

    inventorylist:"/storage/inventory/:search_id/:page",//商品库存信息查询
    inventoryupdate:"/storage/inventory/:update_id",


    discountsearch: "/payment/discount/:search_id/:page",
    discountdelete: "/payment/discount/delete",
    discountinsert:"/payment/discount/insert",
   
    discounttypesearch:"/payment/discount/type/:search_id/:page",
    discounttypeinsert:"/payment/discount/type/insert",

    permissioninfosearch:"/system/permission/getinfo/:search_id",
    permissionandroleinfo:"/system/permissionroleinfo",
    roleinfosearch:"/system/role/getinfo/:search_id"
};
