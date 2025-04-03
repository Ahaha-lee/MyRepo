package storage

import (
	"context"
	"fmt"
	"log"
	stormodels "mygo/storage/models"
)

func (r *StorageGormRepository) UpdateInventoryRepo(ctx context.Context, id int, newStruct *stormodels.InventoryStruct) error {
	if id <= 0 {
		log.Panicln("UpdateInventoryRepo出错1")
		return fmt.Errorf("id不能小于等于0")
	}
	result := r.db.Where("inventory_id = ?", id).Updates(newStruct)
	if result.Error != nil {
		log.Fatalln("UpdateInventoryRepo数据失败", result.Error)
		return result.Error
	}
	return nil
}

func (r *StorageGormRepository) UpdateInventoryQuantities(ctx context.Context, id string, quantities *stormodels.QuantitiesStruct) error {
	if id == "" {
		log.Panicln("UpdateInventoryQuantities出错1")
		return fmt.Errorf("id不能为空")
	}

	// 查询当前库存数量
	log.Println("UpdateInventoryQuantities查询当前库存数量", id)
	var currentInventory stormodels.InventoryStruct
	if err := r.db.Where("inv_barcode = ?", id).First(&currentInventory).Error; err != nil {
		log.Fatalln("UpdateInventoryQuantities查询当前库存数据失败", err)
		return err
	}

	// 计算新的库存数量
	newStockAllQuantity := currentInventory.Stockall_quantity + quantities.Stockall_quantity
	newStockNowQuantity := currentInventory.Stocknow_quantity + quantities.Stocknow_quantity
	newStockOutQuantity := currentInventory.Stockout_quantity + quantities.Stockout_quantity

	log.Println("更新库存数量", newStockAllQuantity, newStockNowQuantity, newStockOutQuantity)
	// 更新库存数量
	result := r.db.Model(&stormodels.InventoryStruct{}).Where("inv_barcode = ?", id).Updates(map[string]interface{}{
		"stockall_quantity": newStockAllQuantity,
		"stocknow_quantity": newStockNowQuantity,
		"stockout_quantity": newStockOutQuantity,
	})
	if result.Error != nil {
		log.Fatalln("UpdateInventoryQuantities数据更新失败", result.Error)
		return result.Error
	}
	return nil
}
func (r *StorageGormRepository) DeleteInventoryRepo(ctx context.Context, inventoryid int) error {
	if inventoryid > 0 {
		result := r.db.Where("inventory_id = ?", inventoryid).Delete(&stormodels.InventoryStruct{})
		if result.Error != nil {
			log.Fatalln("DeleteInventoryRepo数据失败1", result.Error)
			return result.Error
		}
	}
	return nil
}

func (r *StorageGormRepository) SearchInventoryRepo(ctx context.Context, inventoryid int, page int) ([]stormodels.InventoryStruct, int, error) {
	const pageSize = 10
	var inventory []stormodels.InventoryStruct
	var count int64
	offset := (page - 1) * pageSize

	// 构建基础查询
	query := r.db.Table("inventory_data").Select("inventory_data.*, product_data.image_path").
		Joins("LEFT JOIN product_data ON inventory_data.inv_barcode = product_data.pro_barcode")

	if inventoryid != 0 {
		// 如果传入了 inventoryid，添加条件进行查询
		query = query.Where("inventory_data.inventory_id = ?", inventoryid)
	}

	// 获取总数
	if err := query.Count(&count).Error; err != nil {
		log.Printf("SearchInventoryRepo 查询数量失败: %v", err)
		return nil, 0, fmt.Errorf("查询库存数量失败: %w", err)
	}

	// 分页查询
	result := query.Order("inventory_data.inventory_id ASC").
		Limit(pageSize).
		Offset(offset).
		Scan(&inventory)

	// 如果没有找到库存记录，尝试查找特定的 inventoryid
	if result.Error != nil || len(inventory) == 0 {
		if inventoryid != 0 {
			// 尝试单独查找 inventoryid
			var singleInventory stormodels.InventoryStruct
			singleResult := r.db.Table("inventory_data").Select("inventory_data.*, product_data.image_path").
				Joins("LEFT JOIN product_data ON inventory_data.inv_barcode = product_data.pro_barcode").
				Where("inventory_data.inventory_id = ?", inventoryid).
				First(&singleInventory)
			if singleResult.Error == nil {
				inventory = append(inventory, singleInventory)
				count++ // 更新总数
			}
		}
	}

	if result.Error != nil {
		log.Printf("SearchInventoryRepo 分页查询失败: %v", result.Error)
		return nil, 0, fmt.Errorf("分页查询失败: %w", result.Error)
	}

	return inventory, int(count), nil
}
