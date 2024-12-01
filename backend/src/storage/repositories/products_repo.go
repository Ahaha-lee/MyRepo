package storage

import (
	"context"
	"fmt"
	"log"
	stormodels "mygo/storage/models"

	"gorm.io/gorm"
)

type StorageGormRepository struct {
	db *gorm.DB
}

//数据库数据结构变化

func NewStorageGormRepository(db *gorm.DB) *StorageGormRepository {
	// 构造函数
	return &StorageGormRepository{
		db: db,
	}
}

func (r *StorageGormRepository) InsertProductRepo(ctx context.Context, input *stormodels.ProductStruct) error {

	barcode := input.PROBarcode
	data := r.db.Where("PROBarcode = ?", barcode)
	if data.RowsAffected > 0 {
		return (fmt.Errorf("商品已存在"))
	}

	product := stormodels.ProductStruct{
		PROBarcode:     input.PROBarcode,
		Category:       input.Category,
		ProductName:    input.ProductName,
		CostPrice:      input.CostPrice,
		RetailPrice:    input.RetailPrice,
		DetailedlyDesc: input.DetailedlyDesc,
		PROLocation:    input.PROLocation,
	}
	result := r.db.Create(&product)
	if result.Error != nil {
		log.Fatalln("InsertProductRepo数据失败", result.Error)
		return result.Error
	}
	return nil
}
