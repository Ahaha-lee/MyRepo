package storage

import (
	"context"
	"database/sql"
	"fmt"
	stormodels "mygo/storage/models"
	slicepage "mygo/utils"
	"strconv"
	"strings"
	"time"
)

// record==0查询全部
func (r *StorageRepository) GetOutDeclarationInfoRepo(ctx context.Context, recordID int, page int) ([]stormodels.OutDeclaration, int, error) {
	var query string
	var count int
	var err error
	var rows *sql.Rows
	if recordID > 0 {
		query2 := "SELECT COUNT(*) FROM out_declaration WHERE RecordID = ?"
		err := r.db.QueryRowContext(ctx, query2, recordID).Scan(&count)
		if err != nil {
			fmt.Println("GetDeclarationInfoRepo出错1", err)
			return nil, -1, err
		} else if count == 0 {
			return nil, -1, fmt.Errorf("该申请表未存在")
		}
	}
	if recordID > 0 {
		query = "SELECT * FROM out_declaration WHERE RecordID = ?"
		rows, err = r.db.QueryContext(ctx, query, recordID)
		count = 1
	} else if recordID == 0 {
		query = "SELECT count(*) FROM out_declaration"
		err = r.db.QueryRowContext(ctx, query).Scan(&count)
		if err != nil {
			fmt.Println("GeOuttDeclarationInfoRepo出错6:", err)
			return nil, -1, err
		}

		query = slicepage.PaginationQuery(page, 10, "out_declaration")
		rows, err = r.db.QueryContext(ctx, query)

	}

	if err != nil {
		fmt.Println("GetDeclarationInfoRepo出错2:", err)
		return nil, -1, err
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
			return nil, -1, err
		}
		// 将当前结构体添加到切片中
		declarations = append(declarations, declaration)
	}

	// 检查遍历过程中是否发生错误
	if err := rows.Err(); err != nil {
		fmt.Println("GetOutDeclarationInfoRepo出错4:", err)
		return nil, -1, err
	}

	// 返回所有结果
	return declarations, count, nil
}

// 审核 出库
func ChuKuOperatenRepo[T any](ctx context.Context, db *sql.DB, recordID int, newStruct *T) error {
	var count int
	query2 := "SELECT COUNT(*) FROM out_records WHERE RecordID = ?"
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

	query := fmt.Sprintf("UPDATE out_records SET %s WHERE RecordID = ?", strings.Join(fields, ", "))
	args := append(values, recordID)
	_, err = db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("ChuKuOperatenRepo出错2: %w", err)
	}

	return nil
}

// 出库记录
func (r *StorageRepository) GetOutSRecordsRepo(ctx context.Context, recordID int, page int) ([]stormodels.OutRecordsStruct, error) {
	var query string
	var count int
	var err error
	var rows *sql.Rows

	if recordID > 0 {
		query2 := "SELECT COUNT(*) FROM out_records WHERE RecordID = ?"
		err := r.db.QueryRowContext(ctx, query2, recordID).Scan(&count)
		if err != nil {
			fmt.Println("GetOutSRecordsRepo出错1", err)
			return nil, err
		} else if count == 0 {
			return nil, fmt.Errorf("该申请表记录未存在")
		}
	}
	if recordID > 0 {
		query = "SELECT * FROM out_records WHERE RecordID = ?"
		rows, err = r.db.QueryContext(ctx, query, recordID)
	} else if recordID == 0 {

		query3 := "SELECT count(*)  FROM out_records"
		err = r.db.QueryRowContext(ctx, query3).Scan(&count)
		if err != nil {
			fmt.Println("GetOutSRecordsRepo出错6", err)
			return nil, err
		}

		query := slicepage.PaginationQuery(page, 10, "out_records")
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

func (r *StorageRepository) GetCKOperationStatusRepo(ctx context.Context, recordID int, page int) ([]map[string]string, error) {
	var outboundRecords []stormodels.OutRecordsStruct
	var err error

	outboundRecords, err = r.GetOutSRecordsRepo(ctx, recordID, page)
	if err != nil {
		fmt.Println("GetCKOperationStatusRepo出错1", err)
		return nil, err
	}
	if len(outboundRecords) == 0 {
		return nil, fmt.Errorf("未找到出库记录")
	}

	statusList := make([]map[string]string, 0)

	if recordID > 0 {
		// 获取第一条记录
		firstRecord := outboundRecords[0]
		recordStatus := make(map[string]string)

		// 检查指针是否为 nil
		cdata := firstRecord.OCheckResult
		odata := firstRecord.OStoreHouseResult
		idata := strconv.FormatBool(*firstRecord.IsEnd)

		recordStatus["recordid"] = strconv.Itoa(recordID)
		// 检查 cdata 和 odata 是否为 nil
		if cdata != nil {
			recordStatus["checkresult"] = *cdata
		} else {
			recordStatus["checkresult"] = ""
		}

		if odata != nil {
			recordStatus["outresult"] = *odata
		} else {
			recordStatus["outresult"] = ""
		}

		recordStatus["isend"] = idata
		statusList = append(statusList, recordStatus)
	} else {
		// 当 recordID == 0 时，获取所有记录的状态
		for _, record := range outboundRecords {
			recordStatus := make(map[string]string)

			cdata := record.OCheckResult
			odata := record.OStoreHouseResult
			idata := strconv.FormatBool(*record.IsEnd)

			recordStatus["recordid"] = strconv.Itoa(*record.RecordID)
			if cdata != nil {
				recordStatus["checkresult"] = *cdata
			} else {
				recordStatus["checkresult"] = ""
			}

			if odata != nil {
				recordStatus["outresult"] = *odata
			} else {
				recordStatus["outresult"] = ""
			}

			recordStatus["isend"] = idata
			statusList = append(statusList, recordStatus)
		}
	}

	fmt.Println("GetCKOperationStatusRepoStatus", statusList)
	return statusList, nil
}
