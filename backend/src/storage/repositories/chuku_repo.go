package storage

import (
	"context"
	"database/sql"
	"fmt"
	stormodels "mygo/storage/models"
	"strconv"
	"strings"
	"time"
)

// record==0查询全部
func (r *StorageRepository) GetOutDeclarationInfoRepo(ctx context.Context, recordID int) ([]stormodels.OutDeclaration, error) {
	var query string
	var count int
	var err error
	var rows *sql.Rows
	if recordID > 0 {
		query2 := "SELECT COUNT(*) FROM outdeclaration WHERE RecordID = ?"
		err := r.db.QueryRowContext(ctx, query2, recordID).Scan(&count)
		if err != nil {
			fmt.Println("GetDeclarationInfoRepo出错1", err)
			return nil, err
		} else if count == 0 {
			return nil, fmt.Errorf("该申请表未存在")
		}
	}
	if recordID > 0 {
		query = "SELECT * FROM outdeclaration WHERE RecordID = ?"
		rows, err = r.db.QueryContext(ctx, query, recordID)
	} else if recordID == 0 {
		query = "SELECT * FROM outdeclaration"
		rows, err = r.db.QueryContext(ctx, query)
	}

	if err != nil {
		fmt.Println("GetDeclarationInfoRepo出错2:", err)
		return nil, err
	}
	defer rows.Close()

	// 创建一个切片来存储查询结果
	var declarations []stormodels.OutDeclaration

	// 遍历查询结果
	for rows.Next() {
		var declaration stormodels.OutDeclaration
		// 扫描当前行到结构体
		if err := rows.Scan(
			&declaration.Title,
			&declaration.RecordID,
			&declaration.ApplyStaffID,
			&declaration.ApplyStaffName,
			&declaration.Barcode,
			&declaration.OutProductName,
			&declaration.OutQuantity,
			&declaration.OutProductUnit,
			&declaration.OutReason,
			&declaration.ApplyDate); err != nil {
			fmt.Println("GetDeclarationInfoRepo出错3:", err)
			return nil, err
		}
		// 将当前结构体添加到切片中
		declarations = append(declarations, declaration)
	}

	// 检查遍历过程中是否发生错误
	if err := rows.Err(); err != nil {
		fmt.Println("GetOutDeclarationInfoRepo出错4:", err)
		return nil, err
	}

	// 返回所有结果
	return declarations, nil
}

// 审核 出库
func ChuKuOperatenRepo[T any](ctx context.Context, db *sql.DB, recordID int, newStruct *T) error {
	var count int
	query2 := "SELECT COUNT(*) FROM outstoragerecords WHERE RecordID = ?"
	err := db.QueryRowContext(ctx, query2, recordID).Scan(&count)
	if err != nil {
		fmt.Println("CaigouOperatenRepo出错3", err)
		return err
	} else if count == 0 {
		return fmt.Errorf("该申请表未存在")
	}

	fields, values, err := BuildlongQuery(newStruct)
	if err != nil {
		return fmt.Errorf("ChuKuOperatenRepo构建查询出错: %w", err)
	}

	for i := range fields {
		fields[i] = fmt.Sprintf("%s = ?", fields[i])
	}

	query := fmt.Sprintf("UPDATE outstoragerecords SET %s WHERE RecordID = ?", strings.Join(fields, ", "))
	args := append(values, recordID)
	fmt.Println("shuju", args)
	_, err = db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("ChuKuOperatenRepo出错2: %w", err)
	}

	return nil
}

// 出库记录
func (r *StorageRepository) GetOutSRecordsRepo(ctx context.Context, recordID int) ([]stormodels.OutRecordsStruct, error) {
	var query string
	var count int
	var err error
	var rows *sql.Rows

	if recordID > 0 {
		query2 := "SELECT COUNT(*) FROM outstoragerecords WHERE RecordID = ?"
		err := r.db.QueryRowContext(ctx, query2, recordID).Scan(&count)
		if err != nil {
			fmt.Println("GetOutSRecordsRepo出错1", err)
			return nil, err
		} else if count == 0 {
			return nil, fmt.Errorf("该申请表记录未存在")
		}
	}
	if recordID > 0 {
		query = "SELECT * FROM outstoragerecords WHERE RecordID = ?"
		rows, err = r.db.QueryContext(ctx, query, recordID)
	} else if recordID == 0 {
		query = "SELECT * FROM outstoragerecords"
		rows, err = r.db.QueryContext(ctx, query)
	}

	if err != nil {
		fmt.Println("GetOutSRecordsRepo出错2:", err)
		return nil, err
	}

	defer rows.Close()

	var declarations []stormodels.OutRecordsStruct
	for rows.Next() {
		var declaration stormodels.OutRecordsStruct
		var oCheckDateBytes, oOutDataBytes []byte
		if err := rows.Scan(
			&declaration.RecordID,
			&declaration.OCheckStaffID,
			&declaration.OCheckStaffName,
			&declaration.OCheckResult,
			&declaration.OCheckOpinion,
			&oCheckDateBytes,

			&declaration.OStoreHouseStaffID,
			&declaration.OStoreHouseStaffName,
			&declaration.OStoreHouseResult,
			&declaration.OutQuantities,
			&declaration.OStoreHouseOpinion,
			&oOutDataBytes,

			&declaration.IsEnd); err != nil {
			fmt.Println("GetOutSRecordsRepo出错3:", err)
			return nil, err
		}
		if len(oCheckDateBytes) == 0 {
			declaration.CheckDate = nil
		} else {
			cparse, err := time.Parse("2006-01-02 15:04:05", string(oCheckDateBytes))
			if err != nil {
				fmt.Println("解析 CheckDate 出错:", err)
				return nil, err
			}
			declaration.CheckDate = &cparse
		}
		if len(oOutDataBytes) == 0 {
			declaration.OutDate = nil
		} else {
			oparse, err := time.Parse("2006-01-02 15:04:05", string(oOutDataBytes))
			declaration.OutDate = &oparse
			if err != nil {
				fmt.Println("解析OutDate出错:", err)
				return nil, err
			}
		}
		declarations = append(declarations, declaration)
	}
	if err := rows.Err(); err != nil {
		fmt.Println("GetOutSRecordsRepo出错4:", err)
		return nil, err
	}

	return declarations, nil

}

func (r *StorageRepository) GetCKOperationStatusRepo(ctx context.Context, recordID int) (map[string]string, error) {
	var outboundRecords []stormodels.OutRecordsStruct
	var err error

	outboundRecords, err = r.GetOutSRecordsRepo(ctx, recordID)
	if err != nil {
		fmt.Println("GetCKOperationStatusRepo出错1", err)
		return nil, err
	}
	if len(outboundRecords) == 0 {
		return nil, fmt.Errorf("未找到出库记录")
	}

	// 获取第一条记录
	firstRecord := outboundRecords[0]

	// 检查指针是否为 nil
	cdata := firstRecord.OCheckResult
	odata := firstRecord.OStoreHouseResult
	idata := strconv.FormatBool(*firstRecord.IsEnd)

	status := map[string]string{}

	// 检查 cdata 和 odata 是否为 nil
	if cdata != nil {
		status["checkresult"] = *cdata
	} else {
		status["checkresult"] = "无结果"
	}

	if odata != nil {
		status["outresult"] = *odata
	} else {
		status["outresult"] = "无结果"
	}

	status["isend"] = idata

	fmt.Println("GetCKOperationStatusRepoStatus", status)
	return status, nil
}
