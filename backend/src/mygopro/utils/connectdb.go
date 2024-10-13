package shared

import (
	"database/sql"
	"fmt"
)

// 本地数据库连接
func DataBaseConnect() *sql.DB {
	dsn := "root:123456@tcp(127.0.0.1:3306)/dingguaguadb"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		fmt.Println("数据库连接失败")
		return nil
	}

	// 测试连接是否成功
	if err := db.Ping(); err != nil {
		return nil
	}

	return db
}
