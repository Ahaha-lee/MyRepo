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

func (s *StorageGormService) InsertProductInfoServ(ctx context.Context, input []*stormodels.ProductStruct) error {
	err := s.storagegormrepo.InsertProductsRepo(ctx, input) // 调用 InsertProductsRepo
	if err != nil {
		log.Println("InsertProductInfoServ出错1", err)
		return err
	}
	return nil
}
func (s *StorageGormService) SearchProductServ(ctx context.Context, productid int, page int) ([]stormodels.ProductStruct, int, error) {
	product, total_num, err := s.storagegormrepo.SearchProductRepo(ctx, productid, page)
	if err != nil {
		log.Println("SearchProductServ出错1", err)
		return nil, -1, err
	}
	return product, total_num, nil
}
func (s *StorageGormService) UpdateProductServ(ctx context.Context, productid int, product *stormodels.ProductStruct) error {
	err := s.storagegormrepo.UpdateProductRepo(ctx, productid, product)
	if err != nil {
		log.Println("UpdateProductServ出错1", err)
		return err
	}
	return nil
}
func (s *StorageGormService) DeleteProductServ(ctx context.Context, productid int, ids []int) error {

	err := s.storagegormrepo.DeleteProductRepo(ctx, productid, ids)
	if err != nil {
		log.Println("DeleteProductServ出错1", err)
		return err
	}
	return nil
}

// catrgory
func (s *StorageGormService) InsertCategoryServ(ctx context.Context, input *stormodels.CategoryStruct) error {
	err := s.storagegormrepo.InsertCategoryRepo(ctx, input)
	if err != nil {
		log.Println("InsertCategoryServ出错1", err)
		return err
	}
	return nil
}

func (s *StorageGormService) SearchCatrgoryServ(ctx context.Context, categoryid int, categoryname string, page int) ([]stormodels.CategoryStruct, int, error) {
	catrgory, total, err := s.storagegormrepo.SearchCategoryRepo(ctx, categoryid, categoryname, page)
	if err != nil {
		log.Println("SearchCatrgoryServ出错1", err)
		return nil, -1, err
	}
	return catrgory, total, nil
}

func (s *StorageGormService) UpdateCategroyServ(ctx context.Context, categoryid int, category *stormodels.CategoryStruct) error {
	err := s.storagegormrepo.UpdateCategroyRepo(ctx, categoryid, category)
	if err != nil {
		log.Println("UpdateCategroyServ出错", err)
		return err
	}
	return nil
}

func (s *StorageGormService) DeleteCategoryServ(ctx context.Context, categoryid int) error {
	err := s.storagegormrepo.DeleteCategoryRepo(ctx, categoryid)
	if err != nil {
		log.Println("DeleteCategoryServ出错", err)
		return err
	}
	return nil
}

//product cache

//商品预加载的serv

func (s *StorageGormService) PreloadProductsServ(ctx context.Context, ID []int) error {
	err := storrepo.PreloadProductsByID(ID)
	if err != nil {
		log.Println("PreloadProductsServ出错", err)
		return err
	}
	return nil
}

func (s *StorageGormService) GetProductCacheServ(ctx context.Context) ([]stormodels.ProductCache, error) {
	product, err := storrepo.GetAllProductsCache()
	if err != nil {
		log.Println("GetProductServ出错", err)
		return product, err
	}
	return product, nil
}

// GetProduct 获取商品信息

func (s *StorageGormService) GetProductSev(id string) (*[]stormodels.ProductStruct, error) {
	// 从缓存或数据库获取商品
	product, err := storrepo.GetProduct(id)
	if err != nil {
		return nil, err
	}
	return &product, nil
}
