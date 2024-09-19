export const InventoryDataTable = [
    {
        InventoryID: "I001",
        INVBarcode: "123456789001",
        INVProductName: "喜羊羊红色苹果",
        Category: "水果",
        stockUnit: "个",
        stockQuantity: 50,
        cumulativeInbound: 100,
        outboundQuantity: 0,
        remarks: "",
        INVLocation: "常温01号仓库A区01货架"
    },
    {
        InventoryID: "I002",
        INVBarcode: "123456789002",
        INVProductName: "蛋蛋纯牛奶",
        Category: "饮品",
        stockUnit: "瓶",
        stockQuantity: 30,
        cumulativeInbound: 60,
        outboundQuantity: 0,
        remarks: "",
        INVLocation: "常温01号仓库A区02货架01层"
    }
]
export const INVENTORYKEY = 'initialinventory';

//供应商信息表
export const SupplierTable = [
    {
        SupplierID: "S001",
        SupplierAddress: "北京市朝阳区某街道123号",
        SupplierContactName: "张三",
        SupplierContactPhone: "13800138000",
        SupplierContactStandby: "13900139000",
        SupplierEmail: "zhangsan@example.com",
        ApplyDate: "2024-07-01T10:00:00" // ISO 8601 格式的日期时间
    },
    {
        SupplierID: "S002",
        SupplierAddress: "上海市浦东新区某路456号",
        SupplierContactName: "李四",
        SupplierContactPhone: "13700137000",
        SupplierContactStandby: "13600136000",
        SupplierEmail: "lisi@example.com",
        ApplyDate: "2024-07-02T11:30:00" // ISO 8601 格式的日期时间
    }
];
export const SUPPLIERSKEY = 'inisuppliers';

// 存储申报表
export const ProcurementTable=[];
export const PROCUREMENTKEY = 'inicaigoushenbiao';
//存储申报表单后续进度事项 审核 入库  验收 
export const InboundRecordsTable= [];
export const INBOUNDRECORDKEY  ='inicaigourecord';
//出库申请表
export const OutBoundApplyTable = [];
export const OUTAPPLYKEY = 'inioutshenbaobiao';

//出库申请记录
export const OutBoundRecordTAble =[];
export const OUTRECORDKEY = 'inioutrecord';