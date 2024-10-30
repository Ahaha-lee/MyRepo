package payment

import (
	"time"
)

type ProductInsertStruct struct {
	PROBarcode     string  `json:"pROBarcode"`
	Category       string  `json:"category"`
	ProductName    string  `json:"productName"`
	CostPrice      float64 `json:"costPrice"`
	RetailPrice    float64 `json:"retailPrice"`
	DetailedlyDesc string  `json:"detailedlyDesc"`
	PROLocation    string  `json:"pROLocation"`
}

type AllProductinfoStruct struct {
	ProductID           string              `json:"productID"`
	ProductInsertStruct ProductInsertStruct `json:"productInsertStruct"`
}

type SalesOrderStuct struct {
	SaleRecordID    string `json:"saleRecordID"`
	CustomerID      string `json:"customerID"`
	PurchaseTableID string `json:"purchaseTableID"`
	CashierID       string `json:"cashierID"`
}

type PurchaseTableStruct struct {
	PurchaseID             string  `json:"purchaseID"`
	PurchaseproBarcode     string  `json:"purchaseproBarcode"`
	PurchaseproName        string  `json:"purchaseproName"`
	PurchaseproRetailPrice float64 `json:"purchaseproRetailPrice"`
	PurchaseproQuantities  float64 `json:"purchaseproQuantities"`
	ProductUnit            string  `json:"productUnit"`
}

type CategoryStruct struct {
	CategoryID   string `json:"categoryID"`
	CategoryName string `json:"categoryName"`
	CategoryDesc string `json:"categoryDesc"`
}

type DiscountStruct struct {
	DiscountRuleID string    `db:"DiscountRuleID" json:"discountRuleID"`
	RuleType       string    `db:"RuleType" json:"ruleType"`
	MinPrice       float64   `db:"MinPrice" json:"minPrice"`
	DiscountRate   float64   `db:"DiscountRate" json:"discountRate"`
	DiscountAmount float64   `db:"DiscountAmount" json:"discountAmount"`
	IsVIP          bool      `db:"IsVIP" json:"isVIP"`
	StartDate      time.Time `db:"StartDate" json:"startDate"`
	EndDate        time.Time `db:"EndDate" json:"endDate"`
}

type ApplicableItemsStruct struct {
	DiscountRuleID string `json:"discountRuleID"`
	ProductBarcode string `json:"productBarcode"`
}

type ArrayRequest struct {
	Type      string                  `json:"type"`
	Purchases []PurchaseTableStruct   `json:"purchases,omitempty"`
	Items     []ApplicableItemsStruct `json:"items,omitempty"`
}
