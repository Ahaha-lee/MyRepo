
export const ALLPRODUCTS = [
    // 商品总表

    {
        productId: "P001",
        name: "喜羊羊红色苹果",
        price: "3.00元",
        category: "水果",
        manufacturer: "羊村食品有限公司",
        barcode: "123456789001",
        stockQuantity: "100个",
        supplierInfo: "羊村食品有限公司",
        description: "新鲜的红色苹果，口感脆甜，富含维生素C，适合生吃或做成苹果派。",
    },

    {
        productId: "P002",
        name: "蛋蛋纯牛奶",
        price: "5.00元",
        category: "饮品",
        manufacturer: "黑大帅乳业有限公司",
        barcode: "123456789002",
        stockQuantity: "200瓶",
        supplierInfo: "黑大帅乳业有限公司",
        description: "100%纯牛奶，富含蛋白质和钙质，适合全家饮用。"
    },

    {
        productId: "P003",
        name: "全麦面包",
        category: "零食_烘焙",
        stockQuantity: 50,
        stockUnit: "个",
        entryDate: "2023-03-05 08:45",
        minimumStockLevel: 10,
        supplierId: "S003",
        managerId: "M003",
        managerName: "蕉太狼"
    },

    {
        productId: "P004",
        name: "太空洗发水",
        price: "25.00元",
        category: "美容护理",
        manufacturer: "智羊羊美容化妆品有限公司",
        barcode: "123456789004",
        stockQuantity: "75瓶",
        supplierInfo: "智羊羊美容化妆品有限公司",
        description: "温和配方的洗发水，适合各种发质，能有效清洁头发，保持头发光泽。"
    },   

    {
        productId: "P005",
        name: "羊羊透气运动鞋",
        price: "150.00元",
        category: "鞋类",
        manufacturer: "羊村运动先锋有限公司",
        barcode: "123456789005",
        stockQuantity: "30双",
        supplierInfo: "羊村运动先锋有限公司",
        description: "轻便透气的运动鞋，适合跑步和日常穿着，提供良好的支撑和舒适感。",
    },

    {
        productId: "P006",
        name: "知识羊经典文学书籍",
        price: "30.00元",
        category: "图书",
        manufacturer: "羊村大聪明出版社",
        barcode: "123456789006",
        stockQuantity: "120本",
        supplierInfo: "羊村大聪明出版社",
        description: "经典文学作品，适合各个年龄段的读者，提升阅读品味。",
    },

    {
        productId: "P007",
        name: "潇洒哥最新款智能手机",
        price: "3000.00元",
        category: "电子产品",
        manufacturer: "包包大人科技有限公司",
        barcode: "123456789007",
        stockQuantity: "20部",
        supplierInfo: "包包大人科技有限公司",
        description: "最新款智能手机，配备高性能处理器和高清摄像头，支持5G网络。",
    },
    {
        productId: "P008",
        name: "羊村4K高清智能电视",
        price: "5000.00元",
        category: "家电",
        manufacturer: "包包大人科技有限公司",
        barcode: "123456789008",
        stockQuantity: "15台",
        supplierInfo: "包包大人科技有限公司",
        description: "4K高清智能电视，支持多种流媒体应用，带来极致的观影体验。",
    }
];
export const PRODUCTSKEY = "initialproducts";



// 商品分类类型总表
export const PRODUCT_CATEGORIES = [
    { categoryId: "C001", categoryName: "水果" },
    { categoryId: "C002", categoryName: "饮品" },
    { categoryId: "C003", categoryName: "零食_烘焙" },
    { categoryId: "C004", categoryName: "美容护理" },
    { categoryId: "C005", categoryName: "鞋类" },
    { categoryId: "C006", categoryName: "图书" },
    { categoryId: "C007", categoryName: "电子产品" },
    { categoryId: "C008", categoryName: "家电" },
];

export const CATEGORYKEY = 'initialcategory';



