package shared

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	paymentmodels "mygopro/internal/payment/models"
	stormodels "mygopro/internal/storage/models"
	vipmodels "mygopro/internal/vip/models"
	"reflect"
)

func GetTableCount(db *sql.DB, tableName string) (int, error) {
	var count int
	query := fmt.Sprintf("SELECT COUNT(*) FROM %s", tableName)
	fmt.Println(tableName)
	fmt.Println(query)
	err := db.QueryRow(query).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("获取表 %s记录数失败: %w", tableName, err)
	}
	return count, nil
}

func BuildlongQuery[T any](data *T, recordID string) ([]string, []interface{}, error) {
	// 确保 data 是一个指向结构体的指针
	if data == nil {
		return nil, nil, errors.New("data 不能为 nil")
	}

	v := reflect.ValueOf(data).Elem()
	if v.Kind() != reflect.Struct {
		return nil, nil, errors.New("data 必须是一个结构体指针")
	}

	var fields []string
	var values []interface{}

	for i := 0; i < v.NumField(); i++ {
		field := v.Type().Field(i)
		fieldValue := v.Field(i).Interface()

		// 获取字段标签（例如 JSON 标签）
		dbFieldName := field.Tag.Get("db")
		if dbFieldName == "" {
			dbFieldName = field.Name // 如果没有标签，使用字段名
		}

		// 设置 RecordID 字段的值
		if field.Name == "RecordID" && recordID != "" {
			v.FieldByName(field.Name).Set(reflect.ValueOf(recordID))
		} else if field.Name == "ApplyDate" ||
			field.Name == "CheckDate" ||
			field.Name == "OutDate" ||
			field.Name == "PutInDate" ||
			field.Name == "ExamineDate" ||
			field.Name == "UpdatedDate" {
			continue
		} else {
			fields = append(fields, dbFieldName)
			values = append(values, fieldValue)
		}
	}

	return fields, values, nil
}

func GetTableInfo(ctx context.Context, recordid string, tablename string) (interface{}, error) {
	db := DataBaseConnect()
	if db == nil {
		return nil, fmt.Errorf("数据库连接失败")
	}
	defer db.Close()

	var selectdata interface{}
	var query string
	var row *sql.Row

	switch tablename {
	case "procurement":
		selectdata = &stormodels.ProcurmentStruct{}
		query = fmt.Sprintf("SELECT * FROM %s WHERE RecordID=?", tablename)
		row = db.QueryRowContext(ctx, query, recordid)
	case "outdeclaration":
		selectdata = &stormodels.OutDeclaration{}
		query = fmt.Sprintf("SELECT * FROM %s WHERE RecordID=?", tablename)
		row = db.QueryRowContext(ctx, query, recordid)
	case "productsdata":
		selectdata = &paymentmodels.AllProductinfoStruct{}
		query = fmt.Sprintf("SELECT * FROM %s WHERE PROBarcode=? OR ProductName=?", tablename)
		fmt.Println(query)
		row = db.QueryRowContext(ctx, query, recordid, recordid)
	case "inventorydata":
		selectdata = &stormodels.AllInventoryStruct{}
		query = fmt.Sprintf("SELECT * FROM %s WHERE INVBarcode=? OR INVProductName=?", tablename)
		row = db.QueryRowContext(ctx, query, recordid, recordid)
	case "vipmembersdata":
		selectdata = &vipmodels.VIP{}
		query = fmt.Sprintf("SELECT * FROM %s WHERE Phone=?", tablename)
		row = db.QueryRowContext(ctx, query, recordid)
	case "supplierdata":
		selectdata = &stormodels.SuppliersStruct{}
		query = fmt.Sprintf("SELECT * FROM %s WHERE SupplierID=?", tablename)
		row = db.QueryRowContext(ctx, query, recordid)

	default:
		return nil, fmt.Errorf("不支持的表名: %s", tablename)
	}

	val := reflect.ValueOf(selectdata).Elem()
	numFields := val.NumField()
	args := make([]interface{}, 0)

	for i := 0; i < numFields; i++ {
		field := val.Field(i)
		if field.Kind() == reflect.Struct {
			nestedNumFields := field.NumField()
			for j := 0; j < nestedNumFields; j++ {
				args = append(args, field.Field(j).Addr().Interface())
			}
		} else {
			args = append(args, field.Addr().Interface())
		}
	}

	err := row.Scan(args...)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("未找到记录: %w", err)
		}
		return nil, fmt.Errorf("查询失败: %w", err)
	}

	return selectdata, nil
}
