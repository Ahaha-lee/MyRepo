package storage

import (
	"context"
	"log"
	stormodels "mygo/storage/models"
	storrepo "mygo/storage/repositories"
)

type StorageGormService struct {
	storagegormrepo *storrepo.StorageGormRepository
}

func NewStorageGormService(storagegormrepo *storrepo.StorageGormRepository) *StorageGormService {
	return &StorageGormService{
		storagegormrepo: storagegormrepo,
	}
}

func (s *StorageGormService) InsertProductInfoServ(ctx context.Context, input *stormodels.ProductStruct) error {

	err := s.storagegormrepo.InsertProductRepo(ctx, input)
	if err != nil {
		log.Println("InsertProductInfoServ", err)
		return err
	}
	return nil
}
