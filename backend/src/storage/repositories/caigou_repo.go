package storage

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	stormodels "mygo/storage/models"
	slicepage "mygo/utils"
	"strconv"
	"strings"
	"time"
)

type StorageRepository struct {
	db *sql.DB
}

func NewStorageRepository(db *sql.DB) *StorageRepository {
	// 构造函数
	return &StorageRepository{
		db: db,
	}
}

// recordid==0查询全部入库申请表
func (r *StorageRepository) GetProcurementInfoRepo(ctx context.Context, recordId int, currentpage int) ([]stormodels.ProcurmentStruct, int, error) {
	// 执行查询
	var query string
	var count int
	var err error
	var rows *sql.Rows
	if recordId > 0 {
		query2 := "SELECT COUNT(*) FROM in_declaration WHERE RecordID = ?"
		err = r.db.QueryRowContext(ctx, query2, recordId).Scan(&count)
		if err != nil {
			fmt.Println("GetProcurementInfoRepo出错5", err)
			return nil, -1, err
		} else if count == 0 {
			return nil, -1, fmt.Errorf("该申请表记录未存在")
		}
	}
	if recordId > 0 {
		query = "SELECT * FROM in_declaration WHERE RecordID = ?"
		rows, err = r.db.QueryContext(ctx, query, recordId)
		count = 1
	} else if recordId == 0 {
		query3 := "SELECT COUNT(*) FROM in_declaration"
		err = r.db.QueryRowContext(ctx, query3).Scan(&count)
		if err != nil {
			fmt.Println("GetDeclarationInfoRepo出错6:", err)
			return nil, -1, err
		}
		query = slicepage.PaginationQuery(currentpage, 10, "in_declaration")
		rows, err = r.db.QueryContext(ctx, query)
	}

	if err != nil {
		fmt.Println("GetProcurementInfoRepo出错4:", err)
		return nil, -1, err
	}
	defer rows.Close()

	// 创建一个切片来存储查询结果
	var declarations []stormodels.ProcurmentStruct

	// 遍历查询结果
	for rows.Next() {
		var declaration stormodels.ProcurmentStruct
		// 扫描当前行到结构体
		if err := rows.Scan(
			&declaration.Title,
			&declaration.RecordID,
			&declaration.PurchaserStaffID,
			&declaration.PurchaserStaffName,
			&declaration.Barcode,
			&declaration.CGProCategory,
			&declaration.CGProductName,
			&declaration.CGCostPrice,
			&declaration.CGQuantity,
			&declaration.CGProductUnit,
			&declaration.ProductionCompany,
			&declaration.ProductAddress,
			&declaration.ProductDescription,
			&declaration.SelectReason,
			&declaration.SupplierName,
			&declaration.SupplierID,
			&declaration.SupplierAddress,
			&declaration.SupplierContactName,
			&declaration.SupplierContactPhone,
			&declaration.SupplierContactStandby,
			&declaration.SupplierEmail,
			&declaration.ApplyDate); err != nil {
			fmt.Println("GetDeclarationInfoRepo出错2:", err)
			return nil, -1, err
		}
		// 将当前结构体添加到切片中
		declarations = append(declarations, declaration)
	}

	// 检查遍历过程中是否发生错误
	if err := rows.Err(); err != nil {
		fmt.Println("GetProcurementInfoRepo出错3:", err)
		return nil, -1, err
	}
	// 返回所有结果
	return declarations, count, nil

}

// 审核 入库 验收
func CaigouOperatenRepo[T any](ctx context.Context, db *sql.DB, recordID int, newStruct *T) error {
	var count int
	query2 := "SELECT COUNT(*) FROM in_records WHERE RecordID = ?"
	err := db.QueryRowContext(ctx, query2, recordID).Scan(&count)
	fmt.Println(count)
	if err != nil {
		fmt.Println("CaigouOperatenRepo出错3", err)
		return err
	} else if count == 0 {
		return fmt.Errorf("该申请表未存在")
	}

	fields, values, err := BuildlongQuery(newStruct)
	if err != nil {
		return fmt.Errorf("CaigouOperatenRepo构建查询出错: %w", err)
	}

	for i := range fields {
		fields[i] = fmt.Sprintf("%s = ?", fields[i])
	}

	query := fmt.Sprintf("UPDATE in_records SET %s WHERE RecordID = ?", strings.Join(fields, ", "))
	args := append(values, recordID)
	_, err = db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("CaigouOperatenRep出错2: %w", err)
	}

	return nil
}

// 库存数量更改

// 入库记录 in_records
func (r *StorageRepository) GetIbRecordRepo(ctx context.Context, recordId int, page int) ([]stormodels.InboundRecordStruct, int, error) {
	var query string
	var count int
	var err error
	var rows *sql.Rows
	if recordId > 0 {
		query2 := "SELECT COUNT(*) FROM in_records WHERE RecordID = ?"
		err := r.db.QueryRowContext(ctx, query2, recordId).Scan(&count)
		if err != nil {
			fmt.Println("GetIbRecordRepo出错1", err)
			return nil, -1, err
		} else if count == 0 {
			return nil, -1, fmt.Errorf("该申请表未存在")
		}
	}

	if recordId > 0 {
		query = "SELECT * FROM in_records WHERE RecordID = ?"
		rows, err = r.db.QueryContext(ctx, query, recordId)
		count = 1
	} else if recordId == 0 {
		query3 := "SELECT COUNT(*) FROM in_records"
		err = r.db.QueryRowContext(ctx, query3).Scan(&count)
		if err != nil {
			fmt.Println("GetIbRecordRepo出错3:", err)
			return nil, -1, err
		}
		query := slicepage.PaginationQuery(page, 10, "in_records")
		rows, err = r.db.QueryContext(ctx, query)
		if err != nil {
			fmt.Println("GetIbRecordRepo出错4:", err)
			return nil, -1, err
		}

	}

	if err != nil {
		fmt.Println("GetIbRecordRepo出错2:", err)
		return nil, -1, err
	}
	defer rows.Close()

	// 创建一个切片来存储查询结果
	var records []stormodels.InboundRecordStruct
	for rows.Next() {
		var record stormodels.InboundRecordStruct
		var checkDateBytes, putInDateBytes, examineDateBytes []byte // 用于接收字节切片

		if err := rows.Scan(
			&record.RecordID,
			&record.CheckStaffID,
			&record.CheckStaffName,
			&record.CheckResult,
			&record.CheckOpinion,
			&checkDateBytes, // 扫描为字节切片
			&record.StorehouseStaffID,
			&record.StorehouseStaffName,
			&record.PutINResult,
			&record.PutInOpinion,
			&record.PutInQuantities,
			&putInDateBytes,
			&record.ExamineStaffID,
			&record.ExamineStaffName,
			&record.ExamineResult,
			&record.ExamineOpinion,
			&record.ExamineQuantities,
			&examineDateBytes,
			&record.IsEnd); err != nil {
			fmt.Println("GetIbRecordRepo出错3:", err)
			return nil, -1, err
		}
		// 解析字节切片为 time.Time
		if len(checkDateBytes) == 0 {
			record.CheckDate = nil
		} else {
			parsecheck, err := time.Parse("2006-01-02 15:04:05", string(checkDateBytes))
			if err != nil {
				fmt.Println("解析 CheckDate 出错:", err)
				return nil, -1, err
			}
			record.CheckDate = &parsecheck
		}

		if len(putInDateBytes) == 0 {
			record.PutInDate = nil
		} else {
			parseputin, err := time.Parse("2006-01-02 15:04:05", string(putInDateBytes))
			if err != nil {
				fmt.Println("解析 PutInDate 出错:", err)
				return nil, -1, err
			}
			record.PutInDate = &parseputin
		}
		if len(examineDateBytes) == 0 {
			record.ExamineDate = nil
		} else {
			parseexamine, err := time.Parse("2006-01-02 15:04:05", string(examineDateBytes))
			if err != nil {
				fmt.Println("解析 ExamineDate 出错:", err)
				return nil, -1, err
			}
			record.ExamineDate = &parseexamine
		}
		records = append(records, record)
	}
	return records, count, nil
}

// 入库记录的状态
func (r *StorageRepository) GetCGOperationStatusRepo(ctx context.Context, recordID int, page int) ([]map[string]string, error) {
	var in_records []stormodels.InboundRecordStruct
	var err error
	in_records, _, err = r.GetIbRecordRepo(ctx, recordID, page)
	if err != nil {
		fmt.Println("GetCGOperationStatusRepo出错1", err)
		return nil, err
	}
	if len(in_records) == 0 {
		return nil, fmt.Errorf("未找到入库记录")
	}

	status := make([]map[string]string, 0)

	if recordID > 0 {
		// 获取第一条记录
		firstRecord := in_records[0]
		recordStatus := make(map[string]string)

		// 检查指针是否为 nil
		cdata := firstRecord.CheckResult
		pdata := firstRecord.PutINResult
		edata := firstRecord.ExamineResult
		idata := strconv.FormatBool(*firstRecord.IsEnd)

		recordStatus["recordid"] = strconv.Itoa(recordID)

		// 检查 cdata、pdata 和 edata 是否为 nil
		if cdata != nil {
			recordStatus["checkresult"] = *cdata
		} else {
			recordStatus["checkresult"] = ""
		}

		if pdata != nil {
			recordStatus["putinresult"] = *pdata
		} else {
			recordStatus["putinresult"] = ""
		}

		if edata != nil {
			recordStatus["examineresult"] = *edata
		} else {
			recordStatus["examineresult"] = ""
		}

		recordStatus["isend"] = idata
		status = append(status, recordStatus)

	} else if recordID == 0 {
		// 当 recordID == 0 时，获取所有记录的状态
		for _, record := range in_records {
			recordStatus := make(map[string]string)

			cdata := record.CheckResult
			pdata := record.PutINResult
			edata := record.ExamineResult
			idata := strconv.FormatBool(*record.IsEnd)

			recordStatus["recordid"] = strconv.Itoa(*record.RecordID)
			if cdata != nil {
				recordStatus["checkresult"] = *cdata
			} else {
				recordStatus["checkresult"] = ""
			}

			if pdata != nil {
				recordStatus["putinresult"] = *pdata
			} else {
				recordStatus["putinresult"] = ""
			}

			if edata != nil {
				recordStatus["examineresult"] = *edata
			} else {
				recordStatus["examineresult"] = ""
			}
			recordStatus["isend"] = idata
			status = append(status, recordStatus)
		}
	}

	return status, nil
}

func (r *StorageRepository) CGDeclarationUpdateRepo(ctx context.Context, recordid int, newStruct *stormodels.ProcurmentStruct) error {
	if recordid <= 0 {
		log.Panicln("CGDeclarationUpdateRepo出错1")
		return fmt.Errorf("id不能小于等于0")
	}

	fields, values, err := BuildlongQuery(newStruct)
	if err != nil {
		log.Panicln("CGDeclarationUpdateRepo出错2")
		return err
	}

	var columns []string
	var data []interface{}

	for i := 0; i < len(fields); i++ {
		columns = append(columns, fields[i])
		data = append(data, values[i])
	}

	// 构建更新语句
	setClause := strings.Join(columns, " = ?, ") + " = ?"
	query := fmt.Sprintf("UPDATE in_declaration SET %s WHERE RecordID = ?", setClause)
	data = append(data, recordid)

	_, err = r.db.ExecContext(ctx, query, data...)
	if err != nil {
		return fmt.Errorf("CGDeclarationUpdateRepo执行更新出错: %w", err)
	}

	return nil
}
