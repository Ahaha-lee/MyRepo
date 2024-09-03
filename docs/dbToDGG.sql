CREATE DATABASE DingGuaGuaDB; 

USE DingGuaGuaDB; 

CREATE TABLE ProductsData (
    ProductID VARCHAR(20) PRIMARY KEY, -- 商品ID
    PROBarcode VARCHAR(20) UNIQUE, -- 条码
    Category VARCHAR(20), -- 类型
    ProductName VARCHAR(100), -- 商品名称
    CostPrice DECIMAL(10,2), -- 成本价
    RetailPrice DECIMAL(10,2), -- 零售价
    DetailedlyDesc TEXT, -- 详细描述 
    PROLocation VARCHAR(50) -- 商品位置
);

CREATE TABLE PRODUCT_CATEGORIES (
    CategoryID VARCHAR(20) PRIMARY KEY, -- 类型ID
    CategoryName VARCHAR(20) -- 类型名称
);

CREATE TABLE InventoryData (
    InventoryID VARCHAR(20) PRIMARY KEY, -- 库存ID
    INVBarcode VARCHAR(20), -- 商品条码
    INVProductName VARCHAR(50), -- 商品名称
    Category VARCHAR(20), -- 商品类别
    stockUnit VARCHAR(5), -- 数量单位
    stockQuantity DOUBLE, -- 库存可用数量
    cumulativeInbound DOUBLE, -- 库存中累计入库数量
    outboundQuantity DOUBLE, -- 累计出库数量
    remarks VARCHAR(50), -- 备注
    INVLocation VARCHAR(50) -- 库存位置
);

-- 商品采购申报表
CREATE TABLE Procurement (
    Title VARCHAR(20), -- 标题
    RecordID VARCHAR(20) PRIMARY KEY, -- 采购记录ID
    PurchaserStaffID VARCHAR(20), -- 采购员工ID
    PurchaserStaffName VARCHAR(50), -- 采购员工姓名
    CGProductBarcode VARCHAR(20), -- 商品条码
    CGProCategory VARCHAR(20), -- 商品类别
    CGProductName VARCHAR(50), -- 商品名称
    CGCostPrice DECIMAL(10,2), -- 成本价
    CGQuantity DOUBLE, -- 数量
    CGProductUnit VARCHAR(5), -- 单位
    ProductionCompany TEXT, -- 生产公司
    ProductAddress VARCHAR(100), -- 生产地点 省市县
    ProductDescription TEXT, -- 产品描述
    SelectReason TEXT, -- 选择该商品的理由
    SupplierName VARCHAR(50), -- 供应商名称
    SupplierID VARCHAR(20), -- 供应商ID
    SupplierAddress VARCHAR(100), -- 供应商地址
    SupplierContactName VARCHAR(50), -- 供应商直接联系人
    SupplierContactPhone VARCHAR(20), -- 供应商直接联系人电话号码
    SupplierContactStandby VARCHAR(20), -- 供应商备用联系号码
    SupplierEmail VARCHAR(50), -- 供应商公司邮件
    ApplyDate DATETIME -- 申报表提交时间
);

-- 供应商信息
CREATE TABLE SupplierData (
    SupplierID VARCHAR(20) PRIMARY KEY, -- 供应商ID
    SupplierAddress VARCHAR(100), -- 供应商地址
    SupplierContactName VARCHAR(50), -- 供应商直接联系人
    SupplierContactPhone VARCHAR(20), -- 供应商直接联系人电话号码
    SupplierContactStandby VARCHAR(20), -- 供应商备用联系号码
    SupplierEmail VARCHAR(50), -- 供应商公司邮件
    ApplyDate DATETIME -- 申报表提交时间
);

-- 商品入库记录表
CREATE TABLE InboundRecords (
    RecordID VARCHAR(20) PRIMARY KEY, -- 入库记录ID
    INReProductName VARCHAR(50), -- 商品名称
    INReBarcode VARCHAR(20), -- 商品条码
    ApplyStaffID VARCHAR(20), -- 申请员工ID
    ApplyStaffName VARCHAR(50), -- 申请员工姓名
    ApplyCostPrice DECIMAL(10,2), -- 申请成本价
    ApplyQuantities DOUBLE, -- 申请数量
    QuantityUnit VARCHAR(5), -- 数量单位
    ApplyDate DATETIME, -- 申请日期
    CheckStaffID VARCHAR(20), -- 审核负责人ID
    CheckResult VARCHAR(10), -- 审核结果
    CheckOpinion TEXT, -- 审核意见
    CheckDate DATETIME, -- 审核时间
    StorehouseStaffID VARCHAR(20), -- 仓库管理员ID
    PutINResult VARCHAR(10), -- 是否入库
    PutInQuantities INT, -- 入库数量
    PutInDate DATETIME, -- 入库时间
    ExamineStaffID VARCHAR(20), -- 验收人ID
    ExamineResult VARCHAR(10), -- 是否通过验收
    ExamineQuantities DOUBLE, -- 验收通过数量
    ExamineOpinion TEXT, -- 验收意见
    ExamineDate DATETIME -- 验收时间
);

CREATE TABLE Employees (
    EmployeeID VARCHAR(20) PRIMARY KEY, -- 员工ID
    LoginPassword VARCHAR(20), -- 登录密码
    FirstName VARCHAR(50), -- 名
    LastName VARCHAR(50), -- 姓
    Gender VARCHAR(2), -- 性别
    Position VARCHAR(50), -- 职位
    BirthDate DATE, -- 出生日期
    Phone VARCHAR(20), -- 电话
    DateOfEntry DATE, -- 入职日期
    PositionState VARCHAR(5) -- 在职状态
);

-- 会员顾客
CREATE TABLE VipMembersData (
    VIPID VARCHAR(20) PRIMARY KEY, -- 会员ID
    FirstName VARCHAR(50), -- 名
    LastName VARCHAR(50), -- 姓
    Phone VARCHAR(20), -- 电话
    JoinDate DATE, -- 加入日期
    NowPoints INT, -- 当前积分
    UsedPoints INT -- 已使用积分
);
