package storage

type ProductStruct struct {
	ProductID      string  `json:"productID"`
	PROBarcode     string  `json:"pROBarcode"`
	Category       string  `json:"category"`
	ProductName    string  `json:"productName"`
	CostPrice      float64 `json:"costPrice"`
	RetailPrice    float64 `json:"retailPrice"`
	DetailedlyDesc string  `json:"detailedlyDesc"`
	PROLocation    string  `json:"pROLocation"`
}
