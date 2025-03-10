package payment

import (
	"time"
)

// type ProductInsertStruct struct {
// 	PROBarcode     string  `json:"pROBarcode"`
// 	Category       string  `json:"category"`
// 	ProductName    string  `json:"productName"`
// 	CostPrice      float64 `json:"costPrice"`
// 	RetailPrice    float64 `json:"retailPrice"`
// 	DetailedlyDesc string  `json:"detailedlyDesc"`
// 	PROLocation    string  `json:"pROLocation"`
// }

// type AllProductinfoStruct struct {
// 	ProductID           string              `json:"productID"`
// 	ProductInsertStruct ProductInsertStruct `json:"productInsertStruct"`
// }

// type SalesOrderStuct struct {
// 	SaleRecordID    string `json:"saleRecordID"`
// 	CustomerID      string `json:"customerID"`
// 	PurchaseTableID string `json:"purchaseTableID"`
// 	CashierID       string `json:"cashierID"`
// }

// type PurchaseTableStruct struct {
// 	PurchaseID             string  `json:"purchaseID"`
// 	PurchaseproBarcode     string  `json:"purchaseproBarcode"`
// 	PurchaseproName        string  `json:"purchaseproName"`
// 	PurchaseproRetailPrice float64 `json:"purchaseproRetailPrice"`
// 	PurchaseproQuantities  float64 `json:"purchaseproQuantities"`
// 	ProductUnit            string  `json:"productUnit"`
// }

// type ApplicableItemsStruct struct {
// 	DiscountRuleID string `json:"discountRuleID"`
// 	ProductBarcode string `json:"productBarcode"`
// }

// type ArrayRequest struct {
// 	Type      string                  `json:"type"`
// 	Purchases []PurchaseTableStruct   `json:"purchases,omitempty"`
// 	Items     []ApplicableItemsStruct `json:"items,omitempty"`
// }

type DiscountStruct struct {
	DiscountruleId int `gorm:"autoIncrement:true"`
	RuleTypeid     int
	Minprice       float64
	DiscountRate   float64
	DiscountAmount float64
	Isvip          bool
	DiscountItems  string
	StartDate      time.Time
	EndDate        time.Time
	UpdateDate     time.Time `gorm:"autoIncrement:true"`
	Status         int64     `gorm:"-"`
}

func (DiscountStruct) TableName() string {
	return "discount_rules"
}

type DiscountTypeStruct struct {
	Type_id   int `gorm:"autoIncrement:true"`
	Type_name string
	Type_desc string
}

func (DiscountTypeStruct) TableName() string {
	return "discount_type"
}
