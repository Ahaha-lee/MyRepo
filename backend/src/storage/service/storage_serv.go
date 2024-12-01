package storage

import (
	"context"
	"database/sql"
	"fmt"
	storrepo "mygo/storage/repositories"
)

func DeclarationServ[T any](db *sql.DB, input *T, tablename string) error {

	err := storrepo.DeclarationRepo(db, input, tablename)
	if err != nil {
		fmt.Println("DecalarationServ出错1:", err)
		return err
	}
	return nil
}

func (s *StorageService) GetOperationStatusServ(ctx context.Context, recordid int, action string) (map[string]string, error) {
	var status map[string]string
	var err error
	if action == "ck" {
		status, err = s.storagerepo.GetCKOperationStatusRepo(ctx, recordid)
	} else if action == "cg" {
		status, err = s.storagerepo.GetCGOperationStatusRepo(ctx, recordid)
	}
	if err != nil {
		fmt.Println("GetOperationStatusServ出错1:", err)
		return nil, err
	}
	return status, nil

}
