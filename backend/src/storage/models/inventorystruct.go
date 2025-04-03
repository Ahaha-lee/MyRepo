package storage

type InventoryStruct struct {
	Inventory_id      int
	Inv_barcode       string
	Inv_productname   string
	Category          string
	Inv_unit          string
	Stockall_quantity float64
	Stocknow_quantity float64
	Stockout_quantity float64
	Inv_location      string
	Stock_minquantity float64
	Inv_status        string
	ImagePath         string `gorm:"autoIncrement:true"`
}

func (InventoryStruct) TableName() string {
	return "inventory_data"
}

type QuantitiesStruct struct {
	Stockall_quantity float64
	Stocknow_quantity float64
	Stockout_quantity float64
}

func (QuantitiesStruct) TableName() string {
	return "inventory_data"
}
