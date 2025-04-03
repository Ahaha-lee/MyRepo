package storage

import "time"

type ProductStruct struct {
	ProductID      int `gorm:"autoIncrement:true"`
	ProBarcode     string
	Category       string
	ProductName    string
	CostPrice      float64
	RetailPrice    float64
	ProductUnit    string `gorm:"autoIncrement:true"`
	DetailedlyDesc string
	ProLocation    string
	ImagePath      string
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

// ProductStats 商品访问统计
type ProductStats struct {
	ProductBarcode string `gorm:"primaryKey"`
	VisitCount     int
	LastVisitTime  time.Time `gorm:"autoIncrement:true"`
	DailyVisits    int
	WeeklyVisits   int
	MonthlyVisits  int
	UpdatedAt      time.Time `gorm:"autoIncrement:true"`
}

// ProductCache 商品缓存结构
type ProductCache struct {
	Product     ProductStruct
	AccessCount int       // 缓存期间的访问计数
	LastAccess  time.Time // 缓存中的最后访问时间
}

// CacheConfig 缓存配置
type CacheConfig struct {
	MaxSize         int           // 缓存最大容量
	CleanupInterval time.Duration // 清理间隔
	MinAccessCount  int           // 最小访问次数阈值
	ExpirationTime  time.Duration // 数据过期时间
}
