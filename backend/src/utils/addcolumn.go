package utils

import (
	"log"

	"gorm.io/gorm"
)

// addColumn 是一个通用函数，用于在指定的表中添加列
func addColumn(db *gorm.DB, model interface{}, columnName string, columnType string) error {
	// 检查列是否已经存在
	hasColumn := db.Migrator().HasColumn(model, columnName)
	if hasColumn {
		log.Println("表中已存在该列")
		return nil
	}
	// 添加新列
	return db.Migrator().AddColumn(model, columnName)
}
