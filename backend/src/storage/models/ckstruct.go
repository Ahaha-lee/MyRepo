package storage

import "time"

//出库申请表
type OutDeclaration struct {
	Title          string  `json:"title"`
	RecordID       int     `json:"recordID"`
	ApplyStaffName string  `json:"applyStaffName"`
	ApplyStaffID   string  `json:"applyStaffID"`
	Barcode        string  `json:"barcode"`
	OutProductName string  `json:"outProductName"`
	OutQuantity    float64 `json:"outQuantity"`
	OutProductUnit string  `json:"outProductUnit"`
	OutReason      string  `json:"outReason"`
	ApplyDate      string  `json:"applyDate"`
}

type OutCheckStruct struct {
	OCheckStaffID   int       `json:"oCheckStaffID"`
	OCheckStaffName string    `json:"oCheckStaffName"`
	OCheckResult    string    `json:"oCheckResult"`
	OCheckOpinion   string    `json:"oCheckOpinion"`
	CheckDate       time.Time `json:"checkDate"`
}
type OutStorageStruct struct {
	OStoreHouseStaffID   int       `json:"oStoreHouseStaffID"`
	OStoreHouseStaffName string    `json:"oStoreHouseStaffName"`
	OStoreHouseResult    string    `json:"oStoreHouseResult"`
	OutQuantities        float64   `json:"outQuantities"`
	OStoreHouseOpinion   string    `json:"oStoreHouseOpinion"`
	OutDate              time.Time `json:"outDate"`
}

type OutRecordsStruct struct {
	RecordID *int `json:"recordID"`

	OCheckStaffID   *int       `json:"oCheckStaffID"`
	OCheckStaffName *string    `json:"oCheckStaffName"`
	OCheckResult    *string    `json:"oCheckResult"`
	OCheckOpinion   *string    `json:"oCheckOpinion"`
	CheckDate       *time.Time `json:"checkDate"`

	OStoreHouseStaffID   *int       `json:"oStoreHouseStaffID"`
	OStoreHouseStaffName *string    `json:"oStoreHouseStaffName"`
	OStoreHouseResult    *string    `json:"oStoreHouseResult"`
	OutQuantities        *float64   `json:"outQuantities"`
	OStoreHouseOpinion   *string    `json:"oStoreHouseOpinion"`
	OutDate              *time.Time `json:"outDate"`

	IsEnd *bool `json:"isEnd"`
}
