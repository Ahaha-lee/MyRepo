package model

import (
	"time"
)

type PurchaseRecord struct {
	Title                  string    `db:"Title"`
	RecordID               string    `db:"RecordID"`
	PurchaserStaffID       string    `db:"PurchaserStaffID"`
	PurchaserStaffName     string    `db:"PurchaserStaffName"`
	CGProductBarcode       string    `db:"CGProductBarcode"`
	CGProCategory          string    `db:"CGProCategory"`
	CGProductName          string    `db:"CGProductName"`
	CGCostPrice            float64   `db:"CGCostPrice"`
	CGQuantity             float64   `db:"CGQuantity"`
	CGProductUnit          string    `db:"CGProductUnit"`
	ProductionCompany      string    `db:"ProductionCompany"`
	ProductAddress         string    `db:"ProductAddress"`
	ProductDescription     string    `db:"ProductDescription"`
	SelectReason           string    `db:"SelectReason"`
	SupplierName           string    `db:"SupplierName"`
	SupplierID             string    `db:"SupplierID"`
	SupplierAddress        string    `db:"SupplierAddress"`
	SupplierContactName    string    `db:"SupplierContactName"`
	SupplierContactPhone   string    `db:"SupplierContactPhone"`
	SupplierContactStandby string    `db:"SupplierContactStandby"`
	SupplierEmail          string    `db:"SupplierEmail"`
	ApplyDate              time.Time `db:"ApplyDate"`
}
