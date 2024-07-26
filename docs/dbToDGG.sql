create database DingGGDB;
CREATE TABLE Products (
    ProductID INT PRIMARY KEY,
    Category VARCHAR(50),
    Barcode VARCHAR(20),
    ProductName VARCHAR(100),
    ItemNumber VARCHAR(20),
    CostPrice DECIMAL(10,2),
    RetailPrice DECIMAL(10,2),
    Quantity INT,
    Supplier VARCHAR(50),
    Notes TEXT
);
CREATE TABLE Inventory (
    InventoryID INT PRIMARY KEY,
    ProductID INT,
    FirstQuantity INT,
    -- LossAllQuantity INT,
    NowQuantity INT,
    ReorderLevel INT,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
CREATE TABLE InventoryLoss (
    LossID INT PRIMARY KEY,
    ProductID INT,
    LossQuantity INT,
    LossDate DATE,
    LossReason VARCHAR(255),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);
CREATE TABLE Discounts (
    DiscountID INT PRIMARY KEY,
    ProductID INT,
    DiscountRate DECIMAL(3,2),
    StartDate DATE,
    EndDate DATE,
    Notes TEXT,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);


CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Position VARCHAR(50),
    HireDate DATE,
    BirthDate DATE,
    Email VARCHAR(100),
    Phone VARCHAR(20)
);

CREATE TABLE Members (
    MemberID INT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    JoinDate DATE,
    Phone VARCHAR(20),
    Points INT,
    MembershipLevel VARCHAR(50)
);
CREATE TABLE MemberPointsUsage (
    UsageID INT PRIMARY KEY,
    MemberID INT,
    DateUsed DATE,
    PointsUsed INT,
    Reason VARCHAR(100),
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID)
);

CREATE TABLE Sales (
    SaleID INT PRIMARY KEY,
    SaleDate DATE,
    EmployeeID INT,
    MemberID INT,
    ProductID INT,
    Quantity INT,
    TotalPrice DECIMAL(10, 2),
    FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID),
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

