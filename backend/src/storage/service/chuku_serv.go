package storage

import (
	"context"
	"database/sql"
	"fmt"
	stormodels "mygo/storage/models"
	storrepo "mygo/storage/repositories"
)

func (s *StorageService) GetAllOutDeclarationInfoServ(ctx context.Context, recordid int) ([]stormodels.OutDeclaration, error) {

	outdeclaration, err := s.storagerepo.GetOutDeclarationInfoRepo(ctx, recordid)
	if err != nil {
		fmt.Println("GetAllOutDeclarationInfoServ出错1", err)
		return nil, err
	}

	return outdeclaration, nil
}

// 采购操作中 状态不为完成的 outdeclaration 进度的记录合集
func (s *StorageService) GetOutDeclarationInfoServ(ctx context.Context, recordid int) ([]stormodels.OutDeclaration, error) {
	// 从存储库获取数据
	outdeclaration, err := s.storagerepo.GetOutDeclarationInfoRepo(ctx, recordid)
	if err != nil {
		fmt.Println("GetOutDeclarationServ出错1", err)
		return nil, err
	}

	records, err := s.storagerepo.GetOutSRecordsRepo(ctx, recordid)
	if err != nil {
		fmt.Println("GetOutDeclarationServ出错2", err)
		return nil, err
	}

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

	// 使用 map 来提高过滤性能
	idSet := make(map[int]struct{})
	for _, id := range emptyExamineResultIDs {
		idSet[id] = struct{}{}
	}

	var filteredOutDeclaration []stormodels.OutDeclaration
	for _, proc := range outdeclaration {
		if _, exists := idSet[proc.RecordID]; exists {
			filteredOutDeclaration = append(filteredOutDeclaration, proc)
		}
	}

	return filteredOutDeclaration, nil
}

func ChuKuOperatenServ[T any](ctx context.Context, db *sql.DB, recordID int, newStruct *T) error {

	err := storrepo.ChuKuOperatenRepo(ctx, db, recordID, newStruct)
	if err != nil {
		fmt.Println("ChuKuOperatenServ出错1", err)
		return err
	}
	return nil
}
func (s *StorageService) GetOutboundRecordsServ(ctx context.Context, recordID int) ([]stormodels.OutRecordsStruct, error) {
	var err error
	outboundRecords, err := s.storagerepo.GetOutSRecordsRepo(ctx, recordID)
	if err != nil {
		fmt.Println("GetOutboundRecordsServ出错1", err)
	}
	return outboundRecords, nil
}
