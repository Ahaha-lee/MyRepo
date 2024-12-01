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
func (r *StorageRepository) GetProcurementInfoRepo(ctx context.Context, recordId int) ([]stormodels.ProcurmentStruct, error) {
	// 执行查询
	var query string
	var count int
	var err error
	var rows *sql.Rows
	if recordId > 0 {
		query2 := "SELECT COUNT(*) FROM procurement WHERE RecordID = ?"
		err := r.db.QueryRowContext(ctx, query2, recordId).Scan(&count)
		if err != nil {
			fmt.Println("GetProcurementInfoRepo出错5", err)
			return nil, err
		} else if count == 0 {
			return nil, fmt.Errorf("该申请表记录未存在")
		}
	}

	if recordId > 0 {
		query = "SELECT * FROM procurement WHERE RecordID = ?"
		rows, err = r.db.QueryContext(ctx, query, recordId)
	} else if recordId == 0 {
		query = "SELECT * FROM procurement"
		rows, err = r.db.QueryContext(ctx, query)
	}

	if err != nil {
		fmt.Println("GetProcurementInfoRepo出错4:", err)
		return nil, err
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
			return nil, err
		}
		// 将当前结构体添加到切片中
		declarations = append(declarations, declaration)
	}

	// 检查遍历过程中是否发生错误
	if err := rows.Err(); err != nil {
		fmt.Println("GetProcurementInfoRepo出错3:", err)
		return nil, err
	}

	// 返回所有结果
	return declarations, nil
}

// 审核 入库 验收
func CaigouOperatenRepo[T any](ctx context.Context, db *sql.DB, recordID int, newStruct *T) error {
	var count int
	query2 := "SELECT COUNT(*) FROM inboundrecords WHERE RecordID = ?"
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

	query := fmt.Sprintf("UPDATE inboundrecords SET %s WHERE RecordID = ?", strings.Join(fields, ", "))
	args := append(values, recordID)
	_, err = db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("CaigouOperatenRep出错2: %w", err)
	}

	return nil
}

// 库存数量更改

// 入库记录 inboundrecords
func (r *StorageRepository) GetIbRecordRepo(ctx context.Context, recordId int) ([]stormodels.InboundRecordStruct, error) {
	var query string
	var count int
	var err error
	var rows *sql.Rows
	if recordId > 0 {
		query2 := "SELECT COUNT(*) FROM inboundrecords WHERE RecordID = ?"
		err := r.db.QueryRowContext(ctx, query2, recordId).Scan(&count)
		if err != nil {
			fmt.Println("GetIbRecordRepo出错1", err)
			return nil, err
		} else if count == 0 {
			return nil, fmt.Errorf("该申请表未存在")
		}
	}

	if recordId > 0 {
		query = "SELECT * FROM inboundrecords WHERE RecordID = ?"
		rows, err = r.db.QueryContext(ctx, query, recordId)
	} else if recordId == 0 {
		query = "SELECT * FROM inboundrecords"
		rows, err = r.db.QueryContext(ctx, query)
	}

	if err != nil {
		fmt.Println("GetIbRecordRepo出错2:", err)
		return nil, err
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
			return nil, err
		}
		// 解析字节切片为 time.Time
		if len(checkDateBytes) == 0 {
			record.CheckDate = nil
		} else {
			parsecheck, err := time.Parse("2006-01-02 15:04:05", string(checkDateBytes))
			if err != nil {
				fmt.Println("解析 CheckDate 出错:", err)
				return nil, err
			}
			record.CheckDate = &parsecheck
		}

		if len(putInDateBytes) == 0 {
			record.PutInDate = nil
		} else {
			parseputin, err := time.Parse("2006-01-02 15:04:05", string(putInDateBytes))
			if err != nil {
				fmt.Println("解析 PutInDate 出错:", err)
				return nil, err
			}
			record.PutInDate = &parseputin
		}
		if len(examineDateBytes) == 0 {
			record.ExamineDate = nil
		} else {
			parseexamine, err := time.Parse("2006-01-02 15:04:05", string(examineDateBytes))
			if err != nil {
				fmt.Println("解析 ExamineDate 出错:", err)
				return nil, err
			}
			record.ExamineDate = &parseexamine
		}
		records = append(records, record)
	}
	fmt.Println("GetIbRecordRepo", records)
	return records, nil
}

// 一条入库记录的状态
func (r *StorageRepository) GetCGOperationStatusRepo(ctx context.Context, recordID int) (map[string]string, error) {
	var inboundrecords []stormodels.InboundRecordStruct
	var err error
	inboundrecords, err = r.GetIbRecordRepo(ctx, recordID)
	if err != nil {
		fmt.Println("GetCGOperationStatusRepo出错1", err)
		return nil, err
	}
	if len(inboundrecords) == 0 {
		return nil, fmt.Errorf("未找到入库记录")
	}

	// 获取第一条记录
	firstRecord := inboundrecords[0]

	// 检查指针是否为 nil
	cdata := firstRecord.CheckResult
	pdata := firstRecord.PutINResult
	edata := firstRecord.ExamineResult
	idata := strconv.FormatBool(*firstRecord.IsEnd)

	status := map[string]string{}

	// 检查 cdata、pdata 和 edata 是否为 nil
	if cdata != nil {
		status["checkresult"] = *cdata
	} else {
		status["checkresult"] = "无结果"
	}

	if pdata != nil {
		status["putinresult"] = *pdata
	} else {
		status["putinresult"] = "无结果"
	}

	if edata != nil {
		status["examineresult"] = *edata
	} else {
		status["examineresult"] = "无结果"
	}

	status["isend"] = idata

	fmt.Println("GetCGOperationStatusRepoStatus", status)
	return status, nil
}
