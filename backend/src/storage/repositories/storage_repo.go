package storage

import (
	"database/sql"
	"errors"
	"fmt"
	"reflect"
	"strings"
)

func BuildlongQuery[T any](datastruct T) ([]string, []interface{}, error) {
	// 确保 data 是一个指向结构体的指针
	v := reflect.ValueOf(datastruct).Elem()
	if v.Kind() != reflect.Struct {
		fmt.Println("BuildlongQuery出错：datastruct 不能为 nil")
		return nil, nil, errors.New("datastruct 不能为 nil")
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

		fields = append(fields, dbFieldName)
		values = append(values, fieldValue)
	}

	return fields, values, nil
}

func DeclarationRepo[T any](db *sql.DB, declarationStruct *T, tablename string) error {
	var barcode string
	var cloumn []string
	var data []interface{}
	// 构建 SQL 插入语句
	fields, values, err := BuildlongQuery(declarationStruct)
	if err != nil {
		fmt.Println("DeclarationRepo出错1:", err)
		return err
	}
	fmt.Println("字段", fields)
	fmt.Println("值", values)

	for i := 0; i < len(fields); i++ {
		if fields[i] == "RecordID" || fields[i] == "ApplyDate" {
			continue
		} else if fields[i] == "Barcode" {
			barcode = values[i].(string)
			cloumn = append(cloumn, fields[i])
			data = append(data, values[i])
			continue
		} else {
			cloumn = append(cloumn, fields[i])
			data = append(data, values[i])
		}
	}

	//验证商品是否存在
	var count int
	query2 := "select count(*) from product_data where pro_barcode=?"
	err = db.QueryRow(query2, barcode).Scan(&count)
	if err != nil {
		fmt.Println("DeclarationRepo出错2:", err)
		return err
	} else if count == 0 {
		return fmt.Errorf("商品不存在")
	}

	placeholders := strings.Repeat("?, ", len(cloumn)-1) + "?"
	query := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s)", tablename, strings.Join(cloumn, ", "), placeholders)
	// 执行 SQL 插入语句
	_, err = db.Exec(query, data...)
	if err != nil {
		fmt.Println("DeclarationRepo出错3:", err)
		return err
	}
	return nil
}
