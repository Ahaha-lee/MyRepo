package shared

import (
	"fmt"
	"strings"
)

func UpdateTableinfo(tableName string, id string, updates map[string]interface{}, keyword string) error {
	db := DataBaseConnect()
	if db == nil {
		return fmt.Errorf("数据库连接失败")
	}
	defer db.Close()

	setClauses := make([]string, 0, len(updates))
	args := make([]interface{}, 0, len(updates)+1)

	for key, value := range updates {
		setClauses = append(setClauses, fmt.Sprintf("%s = ?", key))
		args = append(args, value)
	}

	args = append(args, id)

	query := fmt.Sprintf("UPDATE %s SET %s WHERE %s = ?", tableName,
		strings.Join(setClauses, ", "), keyword)
	fmt.Println("Query:", query)
	fmt.Println("Args:", args)

	_, err := db.Exec(query, args...)
	if err != nil {
		return fmt.Errorf("执行更新时出错: %w", err)
	}
	return nil
}
