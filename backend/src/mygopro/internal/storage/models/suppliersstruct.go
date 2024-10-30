package storage

type SuppliersStruct struct {
	SupplierID             string `json:"supplierID"`
	SupplierName           string `json:"supplierName"`
	SupplierAddress        string `json:"supplierAddress"`
	SupplierContactName    string `json:"supplierContactName"`
	SupplierContactPhone   string `json:"supplierContactPhone"`
	SupplierContactStandby string `json:"supplierContactStandby"`
	SupplierEmail          string `json:"supplierEmail"`
}
