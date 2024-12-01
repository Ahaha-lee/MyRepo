package storage

import (
	"context"
	"database/sql"
	"fmt"
	stormodels "mygo/storage/models"
	storrepo "mygo/storage/repositories"
)

type StorageService struct {
	storagerepo *storrepo.StorageRepository
}

func NewStorageService(storagerepo *storrepo.StorageRepository) *StorageService {
	return &StorageService{
		storagerepo: storagerepo,
	}
}
func (s *StorageService) GetAllProcurementInfoServ(ctx context.Context, recordid int) ([]stormodels.ProcurmentStruct, error) {
	procurement, err := s.storagerepo.GetProcurementInfoRepo(ctx, recordid)
	if err != nil {
		fmt.Println("GetProcurementInfoServ出错1", err)
		return nil, err
	}
	return procurement, nil
}

// 采购操作中 状态不为完成的 procurement 进度的记录合集
func (s *StorageService) GetProcurementInfoServ(ctx context.Context, recordid int) ([]stormodels.ProcurmentStruct, error) {
	// 从存储库获取数据
	var procurement []stormodels.ProcurmentStruct
	var err error
	procurement, err = s.storagerepo.GetProcurementInfoRepo(ctx, recordid)
	if err != nil {
		fmt.Println("GetProcurementInfoServ出错1", err)
		return nil, err
	}
	records, err := s.storagerepo.GetIbRecordRepo(ctx, recordid)
	if err != nil {
		fmt.Println("GetProcurementInfoServ出错2", err)
		return nil, err
	}

	// 创建一个集合来存储 ExamineResult 为空的记录的 ID
	var emptyExamineResultIDs []int
	if recordid == 0 {
		for _, record := range records {

			// 检查 IsEnd 是否为 nil
			if record.IsEnd != nil && !*record.IsEnd {
				// 检查 RecordID 是否为 nil
				if record.RecordID != nil {
					emptyExamineResultIDs = append(emptyExamineResultIDs, *record.RecordID)
				}
			}
		}
	}

	// 过滤 procurement 中的记录，只保留与 emptyExamineResultIDs 匹配的记录
	var filteredProcurement []stormodels.ProcurmentStruct
	for _, proc := range procurement {
		for _, id := range emptyExamineResultIDs {
			if proc.RecordID == id { // 假设 ProcurmentStruct 也有一个 ID 字段
				filteredProcurement = append(filteredProcurement, proc)
				break // 找到匹配后可以跳出内层循环
			}
		}
	}

	return filteredProcurement, nil
}

// 审核 入库  验收 数据插入
func CaigouOperatenServ[T any](ctx context.Context, db *sql.DB, recordID int, newStruct *T) error {

	err := storrepo.CaigouOperatenRepo(ctx, db, recordID, newStruct)
	if err != nil {
		fmt.Println("CaigouOperatenServ出错1", err)
		return err
	}
	return nil
}

// 获取入库记录数据
func (s *StorageService) GetInboundRecordsServ(ctx context.Context, recordID int) ([]stormodels.InboundRecordStruct, error) {
	var err error
	inboundRecords, err := s.storagerepo.GetIbRecordRepo(ctx, recordID)
	if err != nil {
		fmt.Println("GetInboundRecordsServ出错1", err)
	}
	return inboundRecords, nil
}
