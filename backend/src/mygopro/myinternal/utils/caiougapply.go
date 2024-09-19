package utils

import (
	"database/sql"
	"fmt"
	"reflect"
	"strings"
)

// 使用 getFrontendData 函数从前端获取数据。
// 使用 convertToBackendStruct 函数将前端数据转换为后端结构体。
// 使用 storeInDatabase 函数将后端数据存储到数据库中。
// 将存储的数据赋值给提供的 newStruct 指针。

// 申报 前端填写申报表 这个函数我想要实现的功能是获取前端数据，存到后端数据库，只是前端的请求体不一样，后端的结构体不一样
func Declaration[T any](db *sql.DB, newStruct *T) error {
	// 获取表中记录数
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM procurement").Scan(&count)
	if err != nil {
		return err
	}

	// 生成新的 RecordID
	recordID := fmt.Sprintf("R%d", count+1)

	// 反射获取结构体的字段信息
	v := reflect.ValueOf(newStruct).Elem()
	numFields := v.NumField()

	// 构建 SQL 查询
	var fields []string
	var values []interface{}
	for i := 0; i < numFields; i++ {
		// 如果是 RecordID 字段,则设置为 recordID
		if v.Type().Field(i).Name == "RecordID" {
			values = append(values, recordID)
		} else {
			fields = append(fields, "?")
			values = append(values, v.Field(i).Interface())
		}
	}
	query := fmt.Sprintf("INSERT INTO procurement (%s, RecordID) VALUES (%s, ?)", strings.Join(fields, ", "), strings.Join(make([]string, numFields), ", "))

	// 执行 SQL 查询
	_, err = db.Exec(query, append(values, recordID)...)
	return err
}
