package utils

import (
	"database/sql"
	"encoding/json"

	// "fmt"
	"net/http"
)

// 本地数据库连接
func DataBaseConnect() (*sql.DB, error) {
	dsn := "root:123456@tcp(127.0.0.1:3306)/dingguaguadb"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		return nil, err
	}
	return db, nil
}

// 从前端获取数据
func GetFrontendData(r *http.Request) (interface{}, error) {
	var data interface{}
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		return nil, err
	}
	return data, nil
}

// 将前端数据转换为后端结构体
func ToBackendStruct(data interface{}, newStruct interface{}) error {
	bytes, err := json.Marshal(data)
	if err != nil {
		return err
	}
	return json.Unmarshal(bytes, newStruct)
}
