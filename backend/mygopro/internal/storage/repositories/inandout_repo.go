package storage

// 申报填写函数
// 获取表中的字段与相对应的值函数
// 验收 入库 审核操作的更新数据库的函数

import (
	"context"
	"database/sql"
	"fmt"
	storagemodels "mygopro/internal/storage/models"
	sharedutils "mygopro/utils"
	"reflect"
	"strings"
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

func (r *StorageRepository) GetDeclarData(ctx context.Context, tableName string) ([]string, []string, error) {
	// 执行查询
	query := fmt.Sprintf("SELECT Title, RecordID FROM %s", tableName)
	rows, err := r.db.QueryContext(ctx, query) // 使用 QueryContext 以支持上下文
	if err != nil {
		return nil, nil, fmt.Errorf("查询失败: %w", err)
	}
	defer rows.Close()

	var titles []string
	var recordIDs []string

	// 遍历结果
	for rows.Next() {
		var title string
		var recordID string
		err = rows.Scan(&title, &recordID)
		if err != nil {
			return nil, nil, fmt.Errorf("扫描结果失败: %w", err)
		}
		titles = append(titles, title)          // 将标题添加到切片
		recordIDs = append(recordIDs, recordID) // 将记录ID添加到切片
	}

	// 检查遍历过程中是否发生错误
	if err = rows.Err(); err != nil {
		return nil, nil, fmt.Errorf("遍历结果失败: %w", err)
	}

	return titles, recordIDs, nil
}

// 数据库更新值即可，在inbound再到对应的记录 插入值
func CaigouOperateFun[T any](ctx context.Context, recordID string, newStruct *T) error {
	db := sharedutils.DataBaseConnect()
	if db == nil {
		fmt.Println("数据库连接失败")
	}
	defer db.Close() // 确保在函数结束时关闭数据库连接

	var fields []string
	var values []interface{}
	var err error
	fields, values, err = sharedutils.BuildlongQuery(newStruct, recordID)
	fmt.Println("repoa", newStruct)
	if err != nil {
		return fmt.Errorf("BuildlongQuery出错: %w", err)
	}

	// 构建 SQL 更新语句
	setSQLClause := make([]string, len(fields)) // 使用 make 创建切片
	for i, field := range fields {
		setSQLClause[i] = fmt.Sprintf("%s = ?", field)
	}
	query := fmt.Sprintf("UPDATE in_records SET %s WHERE RecordID = ?", strings.Join(setSQLClause, ", "))
	fmt.Println("生成的更新语句:", query)
	values = append(values, recordID)
	fmt.Println("字段:", fields)
	fmt.Println("值:", values)
	// 执行 SQL 更新语句
	_, err = db.ExecContext(ctx, query, values...)
	if err != nil {
		return fmt.Errorf("执行更新出错: %w", err)
	}

	return nil
}

func OutOperateFun[T any](ctx context.Context, recordID string, newStruct *T) error {
	db := sharedutils.DataBaseConnect()
	if db == nil {
		fmt.Println("数据库连接失败")
	}
	defer db.Close() // 确保在函数结束时关闭数据库连接

	var fields []string
	var values []interface{}
	var err error
	fields, values, err = sharedutils.BuildlongQuery(newStruct, recordID)
	fmt.Println("repo", newStruct)
	if err != nil {
		return fmt.Errorf("BuildlongQuery出错: %w", err)
	}

	// 构建 SQL 更新语句
	setSQLClause := make([]string, len(fields)) // 使用 make 创建切片
	for i, field := range fields {
		setSQLClause[i] = fmt.Sprintf("%s = ?", field)
	}
	query := fmt.Sprintf("UPDATE out_records SET %s WHERE RecordID = ?", strings.Join(setSQLClause, ", "))
	fmt.Println("生成的更新语句:", query)
	values = append(values, recordID)
	fmt.Println("字段:", fields)
	fmt.Println("值:", values)
	// 执行 SQL 更新语句
	_, err = db.ExecContext(ctx, query, values...)
	if err != nil {
		return fmt.Errorf("执行更新出错: %w", err)
	}

	return nil
}

func GetOperationInfo(ctx context.Context, action, tablename string, columns []string, recordid string) (interface{}, error) {
	db := sharedutils.DataBaseConnect()
	if db == nil {
		return nil, fmt.Errorf("数据库连接失败")
	}
	defer db.Close()

	// 将切片中的列名连接成逗号分隔的字符串
	columnsStr := strings.Join(columns, ", ")

	// 根据 action 选择不同的结构体
	var result interface{}
	switch action {
	case "check":
		result = &storagemodels.CaiGouCheckStruct{}
	case "putin":
		result = &storagemodels.CaiGouPutintruct{}
	case "examine":
		result = &storagemodels.CaiGouExamineStruct{}
	case "outcheck":
		result = &storagemodels.OutCheckStruct{}
	case "out":
		result = &storagemodels.OutStorageStruct{}
	default:
		return nil, fmt.Errorf("不支持的表名: %s", action)
	}

	val := reflect.ValueOf(result).Elem()

	query := fmt.Sprintf("SELECT %s FROM %s WHERE RecordID=?", columnsStr, tablename)
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
	fmt.Println("repoOperation", result)
	return result, nil
}

func (r *StorageRepository) UpdateInventoryQuantity(ctx context.Context, tablename string, value float64, keyword string, id string, action string) error {
	var err error
	if action == "caigou" {
		query := fmt.Sprintf("UPDATE %s SET  StockQuantity=StockQuantity+?,CumulativeInbound=CumulativeInbound+? WHERE %s = ?", tablename, keyword)
		fmt.Println(query)
		_, err = r.db.Exec(query, value, value, id)
	} else if action == "out" {
		query := fmt.Sprintf("UPDATE %s SET OutboundQuantity =OutboundQuantity+?, StockQuantity=StockQuantity-? WHERE %s = ?", tablename, keyword)
		fmt.Println(query)
		_, err = r.db.Exec(query, value, value, id)
	}
	if err != nil {
		fmt.Println("库存数量更改失败")
		return err
	}
	return nil
}
