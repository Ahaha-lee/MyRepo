package storage

type ProductStruct struct {
	ProductID      string `gorm:"autoIncrement:true"`
	ProBarcode     string
	Category       string
	ProductName    string
	CostPrice      float64
	RetailPrice    float64
	ProductUnit    string `gorm:"autoIncrement:true"`
	DetailedlyDesc string
	ProLocation    string
}

// 定义表明
func (ProductStruct) TableName() string {
	return "product_data"
}

type CategoryStruct struct {
	CategoryID   int `gorm:"autoIncrement:true"`
	CategoryName string
	CategoryDesc string
}

func (CategoryStruct) TableName() string {
	return "product_categories"
}
