export const ALLINVENTORY = [
    {
        productId: "P001",
        name: "喜羊羊红色苹果",
        category: "水果",
        stockQuantity: 100,
        stockUnit: "个",
        newestEntryDate: "2023-01-15 10:30",
        newestEntryRecord: "R001",
        supplierId: "S001",
        supplierName: "羊村食品有限公司",
        managerId: "M001",
        managerName: "灰太狼",
        isEnough: true
    },
    {
        productId: "P002",
        name: "蛋蛋纯牛奶",
        category: "饮品",
        stockQuantity: 200,
        stockUnit: "瓶",
        newestEntryDate: "2023-02-10 09:15",
        newestEntryRecord: "R001",
        supplierId: "S002",
        supplierName: "狼堡供应链有限公司",
        managerId: "M002",
        managerName: "红太狼",
        isEnough: true
    },
    {
        productId: "P003",
        name: "全麦面包",
        category: "零食_烘焙",
        stockQuantity: 50,
        stockUnit: "个",
        newestEntryDate: "2023-03-05 08:45",
        newestEntryRecord: "R001",
        supplierId: "S003",
        supplierName: "羊村面包坊有限公司",
        managerId: "M003",
        managerName: "蕉太狼",
        isEnough: true
    },
    {
        productId: "P004",
        name: "太空洗发水",
        category: "美容护理",
        stockQuantity: 75,
        stockUnit: "瓶",
        newestEntryDate: "2023-04-01 14:20",
        newestEntryRecord: "R001",
        supplierId: "S004",
        supplierName: "羊村美容有限公司",
        managerId: "M004",
        managerName: "小白狼",
        isEnough: true
    },
    {
        productId: "P005",
        name: "羊羊透气运动鞋",
        category: "鞋类",
        stockQuantity: 30,
        stockUnit: "双",
        newestEntryDate: "2023-05-20 11:00",
        newestEntryRecord: "R001",
        supplierId: "S005",
        supplierName: "羊村运动有限公司",
        managerId: "M001",
        managerName: "灰太狼",
        isEnough: true
    },

    {
        productId: "P006",
        name: "知识羊经典文学书籍",
        category: "图书",
        stockQuantity: 120,
        stockUnit: "本",
        newestEntryDate: "2023-06-15 13:30",
        newestEntryRecord: "R001",
        supplierId: "S006",
        supplierName: "羊村出版社",
        managerId: "M002",
        managerName: "红太狼",
        isEnough: true
    },
    {
        productId: "P007",
        name: "潇洒哥最新款智能手机",
        category: "电子产品",
        stockQuantity: 20,
        stockUnit: "部",
        newestEntryDate: "2023-07-10 15:45",
        newestEntryRecord: "R001",
        supplierId: "S007",
        supplierName: "狼堡科技有限公司",
        managerId: "M003",
        managerName: "蕉太狼",
        isEnough: true
    },
    {
        productId: "P008",
        name: "羊村4K高清智能电视",
        category: "家电",
        stockQuantity: 15,
        stockUnit: "台",
        newestEntryDate: "2023-08-25 16:10",
        newestEntryRecord: "R001",
        supplierId: "S008",
        supplierName: "羊村家电有限公司",
        managerId: "M004",
        managerName: "小白狼",
        isEnough: true
    }
];
export const INVENTORYKEY = 'initialinventory';

//供应商信息表
export const SUPPLIERS = [
    { supplierId: "S001", supplierName: "羊村食品有限公司", contactNumber: "123-456-7890", address: "羊村1号" },
    { supplierId: "S002", supplierName: "狼堡供应链有限公司", contactNumber: "234-567-8901", address: "狼堡2号" },
    { supplierId: "S003", supplierName: "羊村面包坊有限公司", contactNumber: "345-678-9012", address: "羊村3号" },
    { supplierId: "S004", supplierName: "羊村美容有限公司", contactNumber: "456-789-0123", address: "羊村4号" },
    { supplierId: "S005", supplierName: "羊村运动有限公司", contactNumber: "567-890-1234", address: "羊村5号" },
    { supplierId: "S006", supplierName: "羊村出版社", contactNumber: "678-901-2345", address: "羊村6号" },
    { supplierId: "S007", supplierName: "狼堡科技有限公司", contactNumber: "789-012-3456", address: "狼堡7号" },
    { supplierId: "S008", supplierName: "羊村家电有限公司", contactNumber: "890-123-4567", address: "羊村8号" },
];

export const SUPPLIERSKEY = 'initialsuppliers';

//采购申报表 （表单）
export const CAIGOUSB =[];

export const CAIGOUSBKEY = 'initialcaigousb';

//获得许可的申报表
export const AGREECAiGOUSB=[];
export const AGREECGSBKEY = 'initialagreecgsb';