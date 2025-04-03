package storage

import (
	"context"
	"log"
	stormodels "mygo/storage/models"
)

func (s *StorageGormService) UpdateInventoryServ(ctx context.Context, inventoryid int, newStruct *stormodels.InventoryStruct) error {

	err := s.storagegormrepo.UpdateInventoryRepo(ctx, inventoryid, newStruct)
	if err != nil {
		log.Println("UpdateInventoryServ出错1", err)
		return err
	}
	return nil
}
func (s *StorageGormService) UpdateInventoryQuantitiesServ(ctx context.Context, inventoryid string, quantities *stormodels.QuantitiesStruct) error {
	err := s.storagegormrepo.UpdateInventoryQuantities(ctx, inventoryid, quantities)
	if err != nil {
		log.Println("UpdateInventoryQuantitiesServ出错1", err)
		return err
	}
	log.Println("UpdateInventoryQuantitiesServ成功")
	return nil
}
func (s *StorageGormService) DeleteInventoryServ(ctx context.Context, inventoryid int) error {
	err := s.storagegormrepo.DeleteInventoryRepo(ctx, inventoryid)
	if err != nil {
		log.Println("DeleteInventoryServ出错1", err)
		return err
	}
	return nil
}

func (s *StorageGormService) SearchInventoryServ(ctx context.Context, inventoryid int, page int) ([]stormodels.InventoryStruct, int, error) {
	inventory, total, err := s.storagegormrepo.SearchInventoryRepo(ctx, inventoryid, page)
	if err != nil {
		log.Println("SearchInventoryServ出错1", err)
		return nil, -1, err
	}
	return inventory, total, nil
}
