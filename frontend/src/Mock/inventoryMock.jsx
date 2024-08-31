export const ALLINVENTORY = [
    {
        productId: 'P001',
        barcode: "123456789001",
        name: "喜羊羊红色苹果",
        category: "水果",
        stockQuantity: 100,
        cumulativeInbound: 150,
        outboundQuantity: 50,
        stockUnit: "个",
        remarks: ""
    },
    {
        productId: 'P002',
        barcode: "123456789002",
        name: "蛋蛋纯牛奶",
        category: "饮品",
        stockQuantity: 200,
        cumulativeInbound: 300,
        outboundQuantity: 100,
        stockUnit: "瓶",
        remarks: ""
    },
    {
        productId: 'P003',
        barcode: "123456789003",
        name: "全麦面包",
        category: "零食_烘焙",
        stockQuantity: 50,
        cumulativeInbound: 80,
        outboundQuantity: 30,
        stockUnit: "个",
        remarks: ""
    },
    {
        productId: 'P004',
        barcode: "123456789004",
        name: "太空洗发水",
        category: "美容护理",
        stockQuantity: 75,
        cumulativeInbound: 100,
        outboundQuantity: 25,
        stockUnit: "瓶",
        remarks: ""
    },
    {
        productId: 'P005',
        barcode: "123456789005",
        name: "羊羊透气运动鞋",
        category: "鞋类",
        stockQuantity: 30,
        cumulativeInbound: 50,
        outboundQuantity: 20,
        stockUnit: "双",
        remarks: ""
    },
    {
        productId: 'P006',
        barcode: "123456789006",
        name: "知识羊经典文学书籍",
        category: "图书",
        stockQuantity: 120,
        cumulativeInbound: 200,
        outboundQuantity: 80,
        stockUnit: "本",
        remarks: ""
    },
    {
        productId: 'P007',
        barcode: "123456789007",
        name: "潇洒哥最新款智能手机",
        category: "电子产品",
        stockQuantity: 20,
        cumulativeInbound: 30,
        outboundQuantity: 10,
        stockUnit: "部",
        remarks: ""
    },
    {
        productId: 'P008',
        barcode: "123456789008",
        name: "羊村4K高清智能电视",
        category: "家电",
        stockQuantity: 15,//可使用的数量
        cumulativeInbound: 25,//总量
        outboundQuantity: 5,
        stockUnit: "台",
        remarks: ""
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
export const CAIGOUToExsited =[
    {
        title:'喜羊羊红色苹果',
        productName: '喜羊羊红色苹果',
        barcode: "123456789001",
        productId: 'P001',
        productType: '水果',
        productQuantity: 30,
        productUnit: '个',
        productPrice: '3.00',
        priceChangeReason: '',
        productDescription: '好吃的红苹果',
        productionCompany: '羊村食品有限公司',
        reasonForSelection: '好吃好看',
        purchaserId: 'E003',
        purchaserName: '蕉太狼',
        supplierId: 'S001',
        supplierName: '羊村食品有限公司',
        recordid: 'E0',
        productBarcode: '',
    },

    {
            title:'太空洗发水',
            productName: '太空洗发水',
            barcode: "123456789004",
            productId: 'P004',
            productType: '美容护理',
            productQuantity: 30,
            productUnit: '瓶',
            productPrice: '25.00',
            priceChangeReason: '',
            productDescription: '红色包装',
            productionCompany: '羊村美容有限公司',
            reasonForSelection: '好看好用',
            purchaserId: 'E003',
            purchaserName: '蕉太狼',
            supplierId: 'S004',
            supplierName: '羊村美容有限公司',
            recordid: 'E1',
            productBarcode: '',
        },    
];
export const CAIGOUToNOTExisted=[
    {
        title:'小灰灰吸吸果冻',
        productName: '小灰灰吸吸果冻',
        barcode:'852963120',
        productType: '零食_果冻',
        productQuantity: 20,
        productUnit: '个',
        productPrice: '2.00',
        productDescription: '好看好吃',
        productionCompany: '灰灰世界食品有限公司',
        reasonForSelection: '好看好吃，是小灰灰的心头爱',
        purchaserId: 'E004',
        purchaserName: '小白狼',
        supplierName: '灰灰世界有限公司',
        supplierContact: '14563201478',
        supplierAddress: '羊村10号',
        supplierContactName: '孤狼',
        supplierContactPhone: '1458238874252',
        recordid: 'NOTE0'
    }
];

export const CGEXISTEDKEY = 'inicaigouexisted';
export const CGNOTEXISTEDKEY = 'inicaigounotexsited';

//审核过后的申报表
export const CHECKRESULT=[];
export const CHECKRESULTKEY = 'inicheckresult';
