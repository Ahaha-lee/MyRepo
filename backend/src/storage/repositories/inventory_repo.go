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
	var inventory []stormodels.InventoryStruct
	var count int64
	pageSize := 10
	offset := (page - 1) * pageSize

	if inventoryid > 0 {
		resultCount := r.db.Model(&stormodels.InventoryStruct{}).Where("inventory_id = ?", inventoryid).Count(&count)
		if resultCount.Error != nil {
			log.Fatalln("SearchInventoryRepo获取库存数量失败1:", resultCount.Error)
			return nil, -1, resultCount.Error
		}

		result := r.db.Where("inventory_id = ?", inventoryid).Limit(pageSize).Offset(offset).Find(&inventory)
		if result.Error != nil {
			log.Fatalln("SearchInventoryRepo数据失败1", result.Error)
			return nil, -1, result.Error
		}
	} else if inventoryid == 0 {
		// 获取总记录数
		result := r.db.Model(&stormodels.InventoryStruct{}).Count(&count)
		if result.Error != nil {
			return nil, -1, result.Error
		}

		// 分页查询
		pageSize := 10
		offset := (page - 1) * pageSize
		result = r.db.Limit(pageSize).Offset(offset).Find(&inventory)
		if result.Error != nil {
			log.Println("SearchInventoryRepo分页查询失败", result.Error)
			return nil, 0, result.Error
		}
	}
	return inventory, int(count), nil
}
