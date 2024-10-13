package shared

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	stormodels "mygopro/internal/storage/models"
	"reflect"
)

func GetTableCount(db *sql.DB, tableName string) (int, error) {
	var count int
	query := fmt.Sprintf("SELECT COUNT(*) FROM %s", tableName)
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
		if field.Name == "RecordID" {
			v.FieldByName(field.Name).Set(reflect.ValueOf(recordID))
		} else {
			fields = append(fields, dbFieldName)
			values = append(values, fieldValue)
		}
	}

	return fields, values, nil
}

// 获取procurement信息 全部数据或者单独 columnName 里面的所有数据
// keyword的类型范围？

func GetTableInfo(ctx context.Context, recordid string, tablename string) (interface{}, error) {
	db := DataBaseConnect()
	if db == nil {
		return nil, fmt.Errorf("数据库连接失败")
	}
	defer db.Close()

	var procurment interface{}
	switch tablename {
	case "procurement":
		procurment = &stormodels.ProcurmentStruct{}
	case "outdeclaration":
		procurment = &stormodels.OutDeclaration{}

	default:
		return nil, fmt.Errorf("不支持的表名: %s", tablename)
	}

	val := reflect.ValueOf(procurment).Elem()

	query := fmt.Sprintf("SELECT * FROM %s WHERE RecordID=?", tablename)
	row := db.QueryRowContext(ctx, query, recordid)

	// 获取结构体的字段数量
	numFields := val.NumField()

	// 创建一个切片来存储字段的指针
	args := make([]interface{}, numFields)
	for i := 0; i < numFields; i++ {
		args[i] = val.Field(i).Addr().Interface() // 获取字段的地址
	}

	// 扫描结果到结构
	err := row.Scan(args...)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("未找到记录: %w", err)
		}
		return nil, fmt.Errorf("查询失败: %w", err)
	}

	return procurment, nil
}
