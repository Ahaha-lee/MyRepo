package storage

import (
	"context"
	"fmt"
	"log"
	stormodels "mygo/storage/models"
	"strconv"

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

func (r *StorageGormRepository) InsertProductsRepo(ctx context.Context, inputs []*stormodels.ProductStruct) error {
	// 创建一个切片来存储已存在的条形码
	existingBarcodes := make(map[string]struct{})

	// 检查每个产品的条形码是否已存在
	for _, input := range inputs {
		barcode := input.ProBarcode
		var count int64
		r.db.Model(&stormodels.ProductStruct{}).Where("pro_barcode = ?", barcode).Count(&count)
		if count > 0 {
			existingBarcodes[barcode] = struct{}{}
		}
	}

	// 如果有已存在的条形码，返回错误
	if len(existingBarcodes) > 0 {
		return fmt.Errorf("以下商品已存在: %v", existingBarcodes)
	}

	// 执行批量插入
	result := r.db.Create(inputs) // 这里直接传递 inputs
	if result.Error != nil {
		log.Fatalln("InsertProductsRepo数据失败", result.Error)
		return result.Error
	}

	// 插入到 product_stats 表
	for _, input := range inputs {
		barcode := input.ProBarcode
		statsResult := r.db.Exec("INSERT INTO product_stats (product_barcode, visit_count, last_visit_time, daily_visits, weekly_visits, monthly_visits) VALUES (?, 1, NOW(), 1, 1, 1)", barcode)
		if statsResult.Error != nil {
			log.Fatalln("插入 product_stats 数据失败", statsResult.Error)
			return statsResult.Error
		}
	}

	return nil
}
func (r *StorageGormRepository) SearchProductRepo(ctx context.Context, productid int, page int) ([]stormodels.ProductStruct, int, error) {
	var product []stormodels.ProductStruct
	var count int64
	pageSize := 10
	offset := (page - 1) * pageSize

	if productid == 0 {
		// 查询所有记录
		resultCount := r.db.Model(&stormodels.ProductStruct{}).Count(&count)
		if resultCount.Error != nil {
			log.Fatalln("SearchProductRepo获取产品数量失败:", resultCount.Error)
			return nil, -1, resultCount.Error
		}

		// 分页查询所有产品
		result := r.db.Limit(pageSize).Offset(offset).Find(&product)
		if result.Error != nil {
			log.Println("SearchProductRepo分页查询所有产品失败", result.Error)
			return nil, -1, result.Error
		}
	} else if productid > 0 {

		// 查询符合条件的记录数
		productidStr := strconv.Itoa(productid) // 将 productid 转换为字符串
		resultCount := r.db.Model(&stormodels.ProductStruct{}).Where("product_id LIKE ? OR product_name LIKE ?", "%"+productidStr+"%", "%"+productidStr+"%").Count(&count)
		if resultCount.Error != nil {
			log.Fatalln("SearchProductRepo获取产品数量失败:", resultCount.Error)
			return nil, -1, resultCount.Error
		}

		// 分页查询符合条件的产品信息
		result := r.db.Where("product_id LIKE ? OR product_name LIKE ?", "%"+productidStr+"%", "%"+productidStr+"%").Limit(pageSize).Offset(offset).Find(&product)
		if result.Error != nil {
			log.Fatalln("SearchProductRepo数据失败:", result.Error)
			return nil, -1, result.Error
		}

	}

	return product, int(count), nil
}

func (r *StorageGormRepository) UpdateProductRepo(ctx context.Context, productid int, product *stormodels.ProductStruct) error {
	if productid > 0 {
		result := r.db.Model(&stormodels.ProductStruct{}).Where("product_id = ?", productid).Updates(product)
		if result.Error != nil {
			log.Fatalln("UpdateProductRepo数据失败1", result.Error)
			return result.Error
		}

		// 假设库存表的模型是 StockStruct，并且有一个方法 UpdateStock
		stockUpdate := &stormodels.InventoryStruct{
			Inv_productname: product.ProductName,
			Category:        product.Category,
			Inv_unit:        product.ProductUnit,
		}

		// 更新库存信息
		stockResult := r.db.Model(&stormodels.InventoryStruct{}).Where("inventory_id = ?", productid).Updates(stockUpdate)
		if stockResult.Error != nil {
			log.Fatalln("UpdateProductRepo数据失败2", stockResult.Error)
			return stockResult.Error
		}
	}
	return nil
}

func (r *StorageGormRepository) DeleteProductRepo(ctx context.Context, productid int, ids []int) error {
	// 开始一个新的事务
	tx := r.db.Begin()

	// 确保在函数结束时处理事务
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback() // 如果发生恐慌，回滚事务
		}
	}()

	if productid == 0 {
		if len(ids) == 0 {
			return fmt.Errorf("DeleteProductRepo: ids数组为空")
		}

		// 查询 product_data 表中的 barcode
		var barcodes []string
		if err := tx.Raw("SELECT pro_barcode FROM product_data WHERE product_id IN ?", ids).Scan(&barcodes).Error; err != nil {
			tx.Rollback() // 查询失败，回滚事务
			return err
		}
		log.Println("dg", barcodes)

		// 删除 product_stas 表中对应的记录
		if err := tx.Where("product_barcode IN ?", barcodes).Delete(&stormodels.ProductStats{}).Error; err != nil {
			tx.Rollback() // 删除失败，回滚事务
			return err
		}
		// 从缓存中删除对应的记录
		DeleteProductCache(barcodes)

		// 批量删除商品
		product := stormodels.ProductStruct{}
		if err := tx.Where("product_id IN ?", ids).Delete(&product).Error; err != nil {
			tx.Rollback() // 删除失败，回滚事务
			return err
		}

		// 更新库存表中的 ID 为 -1
		if err := tx.Model(&stormodels.InventoryStruct{}).Where("inventory_id IN ?", ids).Update("inv_status", "已下架").Error; err != nil {
			tx.Rollback() // 更新失败，回滚事务
			return err
		}

	} else if productid > 0 {
		// // 单个删除商品
		// product := stormodels.ProductStruct{}
		// if err := tx.Where("product_id = ?", productid).Delete(&product).Error; err != nil {
		// 	tx.Rollback() // 删除失败，回滚事务
		// 	return err
		// }

		// // 更新库存表中的 ID 为 -1
		// if err := tx.Model(&stormodels.InventoryStruct{}).Where("inventory_id = ?", productid).Update("inv_status", "已下架").Error; err != nil {
		// 	tx.Rollback() // 更新失败，回滚事务
		// 	return err
		// }

		// // 删除 product_stas 表中对应的记录
		// if err := tx.Where("barcode = (SELECT barcode FROM products WHERE product_id = ?)", productid).Delete(&stormodels.ProductStats{}).Error; err != nil {
		// 	tx.Rollback() // 删除失败，回滚事务
		// 	return err
		// }

		// // 从缓存中删除对应的记录
		// r.productCache.Delete(productid) // 假设 productid 是缓存的键
	}
	// 提交事务
	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}

//商品类型表

func (r *StorageGormRepository) InsertCategoryRepo(ctx context.Context, input *stormodels.CategoryStruct) error {

	categoryname := input.CategoryName
	data := r.db.Where("category_name = ?", categoryname)
	if data.RowsAffected > 0 {
		return (fmt.Errorf("类型重复"))
	}
	category := stormodels.CategoryStruct{
		CategoryID:   input.CategoryID,
		CategoryName: input.CategoryName,
		CategoryDesc: input.CategoryDesc,
	}
	result := r.db.Create(&category)
	if result.Error != nil {
		log.Fatalln("InsertCategoryRepo数据失败", result.Error)
		return result.Error
	}
	return nil
}
func (r *StorageGormRepository) SearchCategoryRepo(ctx context.Context, categoryid int, categoryName string, page int) ([]stormodels.CategoryStruct, int, error) {
	var category []stormodels.CategoryStruct
	var count int64
	if categoryid == 0 && categoryName == "" {
		// 获取总记录数
		result1 := r.db.Model(&stormodels.CategoryStruct{}).Count(&count)
		if result1.Error != nil {
			return nil, -1, result1.Error
		}
		//分页
		result := r.db.Offset((page - 1) * 10).Limit(10).Find(&category)
		if result.Error != nil {
			log.Fatalln("SearchCategoryRepo 数据失败", result.Error)
			return nil, -1, result.Error
		}
	} else {
		result := r.db.Where("category_id = ? OR category_name = ?", categoryid, categoryName).Find(&category)
		if result.Error != nil {
			log.Fatalln("SearchCategoryRepo数据失败2", result.Error)
			return nil, -1, result.Error
		}
		count = 1
	}
	return category, int(count), nil
}

func (r *StorageGormRepository) DeleteCategoryRepo(ctx context.Context, categoryid int) error {
	if categoryid > 0 {
		result := r.db.Where("category_id = ?", categoryid).Delete(&stormodels.CategoryStruct{})
		if result.Error != nil {
			log.Fatalln("DeleteCategoryRepo数据失败", result.Error)
			return result.Error
		}
	}

	return nil
}

func (r *StorageGormRepository) UpdateCategroyRepo(ctx context.Context, categoryid int, category *stormodels.CategoryStruct) error {
	if categoryid > 0 {
		result := r.db.Where("category_id = ?", categoryid).Updates(category)
		if result.Error != nil {
			log.Fatalln("UpdateCategroyRepo数据失败", result.Error)
			return result.Error
		}
	}
	return nil
}
