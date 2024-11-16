package storage

type InventoryStruct struct {
	INVBarcode        string  `json:"INVBarcode"`
	INVProductName    string  `json:"INVProductName"`
	Category          string  `json:"Category"`
	StockUnit         string  `json:"StockUnit"`
	StockQuantity     float64 `json:"StockQuantity"`
	CumulativeInbound float64 `json:"CumulativeInbound"`
	OutboundQuantity  float64 `json:"OutboundQuantity"`
	INVLocation       string  `json:"INVLocation"`
	MinQuantity       float64 `json:"MinQuantity"`
}

type AllInventoryStruct struct {
	InventoryID     string          `json:"inventoryID"`
	InventoryStruct InventoryStruct `json:"inventoryStruct"`
}
