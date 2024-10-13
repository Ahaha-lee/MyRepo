package storage

import (
	"context"
	"fmt"
	stormodels "mygopro/internal/storage/models"
	storrepo "mygopro/internal/storage/repositories"
	sharedutils "mygopro/utils"
)

type StorageService struct {
	storagerepo *storrepo.StorageRepository
}

func NewStorageService(storagerepo *storrepo.StorageRepository) *StorageService {
	return &StorageService{
		storagerepo: storagerepo,
	}
}
func (s *StorageService) ShowList(ctx context.Context, tablename string) ([]string, []string, error) {
	// 从存储库获取数据
	titles, recordids, err := s.storagerepo.GetDeclarData(ctx, tablename)
	if err != nil {
		return nil, nil, err // 返回错误
	}

	// fmt.Println("service", titles, recordids)

	return titles, recordids, nil
}

func (s *StorageService) ShowTableInfo(ctx context.Context, recordid string, tablename string) (interface{}, error) {
	// 调用 GetTableInfo 函数获取数据
	procurement, err := sharedutils.GetTableInfo(ctx, recordid, tablename)
	if err != nil {
		fmt.Println("service error:", err)
		return nil, err
	}

	return procurement, nil
}

func (s *StorageService) GaiGouCheck(ctx context.Context, recordid string, checkstruct stormodels.CaiGouCheckStruct) error {
	err := storrepo.CaigouOperateFun(ctx, recordid, &checkstruct)
	if err != nil {
		fmt.Println("service", err)
		return err
	}
	return nil
}

func (s *StorageService) GaiGouPutin(ctx context.Context, recordid string, putinstruct stormodels.CaiGouPutintruct) error {
	err := storrepo.CaigouOperateFun(ctx, recordid, &putinstruct)
	if err != nil {
		fmt.Println("service", err)
		return err
	}
	return nil
}
func (s *StorageService) GaiGouExamine(ctx context.Context, recordid string, Examinestruct stormodels.CaiGouExamineStruct) error {
	err := storrepo.CaigouOperateFun(ctx, recordid, &Examinestruct)
	if err != nil {
		fmt.Println("service", err)
		return err
	}
	return nil
}

func OperateInfo[T any](ctx context.Context, action string, recordid string, newStruct *T) (interface{}, error) {

	var columns []string
	var tablename string

	switch action {
	case "check":
		columns = []string{
			"CheckStaffID",
			"CheckStaffName",
			"CheckResult",
			"CheckOpinion",
			"CheckDate",
		}
		tablename = "inboundrecords" // 修正赋值

	case "putin":
		columns = []string{
			"StorehouseStaffID",
			"PutINResult",
			"PutinOpinion",
			"PutInQuantities",
			"PutInDate",
		}
		tablename = "inboundrecords" // 修正赋值

	case "examine":
		columns = []string{
			"ExamineStaffID",
			"ExamineResult",
			"ExamineOpinion",
			"ExamineQuantities",
			"ExamineDate",
		}
		tablename = "inboundrecords" // 修正赋值

	case "outcheck":
		columns = []string{
			"OCheckStaffName",
			"OCheckStaffID",
			"OCheckResult",
			"OCheckOpinion",
			"OCheckDate",
		}
		tablename = "outstoragerecords" // 修正赋值

	case "out":
		columns = []string{
			"OStoreHouseStaffID",
			"OStoreHouseStaffName",
			"OStoreHouseResult",
			"OStoreHouseOpinion",
			"OutDate",
		}
		tablename = "outstoragerecords" // 修正赋值
	}

	// 调用存储库函数
	record, err := storrepo.GetOperationInfo(ctx, action, tablename, columns, recordid) // 修正变量名
	if err != nil {
		fmt.Println("service error:", err)
		return nil, err
	}
	fmt.Println("ser", record)
	return record, nil
}
func (s *StorageService) OutCheck(ctx context.Context, recordid string, CheckStruct stormodels.OutCheckStruct) error {
	err := storrepo.OutOperateFun(ctx, recordid, &CheckStruct)
	if err != nil {
		fmt.Println("service", err)
		return err
	}
	return nil
}
func (s *StorageService) OutStorage(ctx context.Context, recordid string, OutStorageStruct stormodels.OutStorageStruct) error {
	err := storrepo.OutOperateFun(ctx, recordid, &OutStorageStruct)
	if err != nil {
		fmt.Println("service", err)
		return err
	}
	return nil
}
