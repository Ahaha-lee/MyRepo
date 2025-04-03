package order

type OrderIndexStruct struct {
	SaleOrderid     int `gorm:"primaryKey;autoIncrement"`
	VipId           int
	CashierId       float64
	OrderTotalprice float64
	OrderDate       string `gorm:"autoIncrement:true"`
}

func (OrderIndexStruct) TableName() string {
	return "sales_orderindex"
}

type OrderProductStruct struct {
	SaleOrderid           int
	ProductBarcode        string
	ProductRetailprice    float64
	ProductDiscountruleid string
	ProductQuantities     float64
}

func (OrderProductStruct) TableName() string {
	return "sales_ordercontent"
}
