package storage

import "time"

// 采购申请表
type ProcurmentStruct struct {
	Title                  string  `json:"title"`
	RecordID               int     `json:"recordID"`
	PurchaserStaffID       int     `json:"purchaserStaffID"`
	PurchaserStaffName     string  `json:"purchaserStaffName"`
	Barcode                string  `json:"barcode"`
	CGProCategory          string  `json:"cGProCategory"`
	CGProductName          string  `json:"cGProductName"`
	CGCostPrice            float64 `json:"cGCostPrice"`
	CGQuantity             float64 `json:"cGQuantity"`
	CGProductUnit          string  `json:"cGProductUnit"`
	ProductionCompany      string  `json:"productionCompany"`
	ProductAddress         string  `json:"productAddress"`
	ProductDescription     string  `json:"productDescription"`
	SelectReason           string  `json:"selectReason"`
	SupplierName           string  `json:"supplierName"`
	SupplierID             int     `json:"supplierID"`
	SupplierAddress        string  `json:"supplierAddress"`
	SupplierContactName    string  `json:"supplierContactName"`
	SupplierContactPhone   string  `json:"supplierContactPhone"`
	SupplierContactStandby string  `json:"supplierContactStandby"`
	SupplierEmail          string  `json:"supplierEmail"`
	ApplyDate              string  `json:"applyDate"`
}

// 审核采购申报表
type CaiGouCheckStruct struct {
	CheckStaffID   *int       `json:"checkStaffID,omitempty"`
	CheckStaffName *string    `json:"checkStaffName,omitempty"`
	CheckResult    *string    `json:"checkResult,omitempty"`
	CheckOpinion   *string    `json:"checkOpinion,omitempty"`
	CheckDate      *time.Time `json:"checkDate,omitempty"`
}

type CaiGouPutintruct struct {
	StorehouseStaffID   *int       `json:"storehouseStaffID,omitempty"`
	StorehouseStaffName *string    `json:"storehouseStaffName,omitempty"`
	PutINResult         *string    `json:"putINResult,omitempty"`
	PutInOpinion        *string    `json:"putInOpinion,omitempty"`
	PutInQuantities     *float64   `json:"putInQuantities,omitempty"`
	PutInDate           *time.Time `json:"putInDate,omitempty"`
}

type CaiGouExamineStruct struct {
	ExamineStaffID    *int       `json:"examineStaffID,omitempty"`
	ExamineStaffName  *string    `json:"examineStaffName,omitempty"`
	ExamineResult     *string    `json:"examineResult,omitempty"`
	ExamineOpinion    *string    `json:"examineOpinion,omitempty"`
	ExamineQuantities *float64   `json:"examineQuantities,omitempty"`
	ExamineDate       *time.Time `json:"examineDate,omitempty"`
}

type InboundRecordStruct struct {
	RecordID *int `json:"recordID,omitempty"`
	// 审核信息
	CheckStaffID   *int       `json:"checkStaffID,omitempty"`
	CheckStaffName *string    `json:"checkStaffName,omitempty"`
	CheckResult    *string    `json:"checkResult,omitempty"`
	CheckOpinion   *string    `json:"checkOpinion,omitempty"`
	CheckDate      *time.Time `json:"checkDate,omitempty"`

	// 入库信息
	StorehouseStaffID   *int       `json:"storehouseStaffID,omitempty"`
	StorehouseStaffName *string    `json:"storehouseStaffName,omitempty"`
	PutINResult         *string    `json:"putINResult,omitempty"`
	PutInOpinion        *string    `json:"putInOpinion,omitempty"`
	PutInQuantities     *float64   `json:"putInQuantities,omitempty"`
	PutInDate           *time.Time `json:"putInDate,omitempty"`

	// 审查信息
	ExamineStaffID    *int       `json:"examineStaffID,omitempty"`
	ExamineStaffName  *string    `json:"examineStaffName,omitempty"`
	ExamineResult     *string    `json:"examineResult,omitempty"`
	ExamineOpinion    *string    `json:"examineOpinion,omitempty"`
	ExamineQuantities *float64   `json:"examineQuantities,omitempty"`
	ExamineDate       *time.Time `json:"examineDate,omitempty"`

	IsEnd *bool `json:"isEnd,omitempty"`
}

type CGOperationStatus struct {
	CheckResult         *string `json:"checkResult,omitempty"`
	PutInResult         *string `json:"putInResult,omitempty"`
	CaiGouExamineStruct *string `json:"caiGouExamineStruct,omitempty"`
}
