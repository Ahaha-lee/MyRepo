package model

// 采购申请表
type ProcurmentStruct struct {
	Title                  string  `json:"title"`
	RecordID               string  `json:"recordID"`
	PurchaserStaffID       string  `json:"purchaserStaffID"`
	PurchaserStaffName     string  `json:"purchaserStaffName"`
	CGProductBarcode       string  `json:"cGProductBarcode"`
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
	SupplierID             string  `json:"supplierID"`
	SupplierAddress        string  `json:"supplierAddress"`
	SupplierContactName    string  `json:"supplierContactName"`
	SupplierContactPhone   string  `json:"supplierContactPhone"`
	SupplierContactStandby string  `json:"supplierContactStandby"`
	SupplierEmail          string  `json:"supplierEmail"`
	ApplyDate              string  `json:"applyDate"`
}

type OutDeclaration struct {
	Title             string  `json:"title"`
	RecordID          string  `json:"recordID"`
	ApplyStaffName    string  `json:"applyStaffName"`
	ApplyStaffID      string  `json:"applyStaffID"`
	OutProductBarcode string  `json:"outProductBarcode"`
	OutProductName    string  `json:"outProductName"`
	OutQuantity       float64 `json:"outQuantity"`
	OutProductUnit    string  `json:"outProductUnit"`
	OutReason         string  `json:"outReason"`
	OutApplyTime      string  `json:"outApplyTime"`
}

// 申报后的操作

type CGrequestBody struct {
	Action   string `json:"action"`
	RecordID string `json:"recordid"`
}

// 审核采购申报表
type CaiGouCheckStruct struct {
	CheckStaffID   string `json:"checkstaffid"`
	CheckStaffName string `json:"checkstaffname"`
	CheckResult    string `json:"checkresult"`
	CheckOpinion   string `json:"checkopinion"`
	CheckDate      string `json:"checkDate"`
}

type CaiGouPutintruct struct {
	StorehouseStaffID string  `json:"storehouseStaffID"`
	PutINResult       string  `json:"putINResult"`
	PutinOpinion      string  `json:"putinOpinion"`
	PutInQuantities   float64 `json:"putInQuantities"`
	PutInDate         string  `json:"putInDate"`
}

type CaiGouExamineStruct struct {
	ExamineStaffID    string  `json:"ExamineStaffID"`
	ExamineResult     string  `json:"ExamineResult"`
	ExamineOpinion    string  `json:"ExamineOpinion"`
	ExamineQuantities float64 `json:"ExamineQuantities"`
	ExamineDate       string  `json:"ExamineDate"`
}

// type CaiGouProcess struct {
// 	RecordID string              `json:"recordid"`
// 	Check    CaiGouCheckStruct   `json:"check"`
// 	PutIn    CaiGouPutintruct    `json:"putIn"`
// 	Examine  CaiGouExamineStruct `json:"examine"`
// }

type OutCheckStruct struct {
	OCheckStaffID   string `json:"oCheckStaffID"`
	OCheckStaffName string `json:"oCheckStaffName"`
	OCheckResult    string `json:"oCheckResult"`
	OCheckOpinion   string `json:"oCheckOpinion"`
	OCheckDate      string `json:"oCheckDate"`
}
type OutStorageStruct struct {
	OStoreHouseStaffID   string `json:"oStoreHouseStaffID"`
	OStoreHouseStaffName string `json:"oStoreHouseStaffName"`
	OStoreHouseResult    string `json:"oStoreHouseResult"`
	OStoreHouseOpinion   string `json:"oStoreHouseOpinion"`
	OutDate              string `json:"outDate"`
}
