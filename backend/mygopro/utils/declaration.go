package shared

import (
	"database/sql"
	"fmt"
	storagemodels "mygopro/internal/storage/models"
	"net/http"
	"strings"
)

// 申报 前端填写申报表 这个函数我想要实现的功能是获取前端数据，存到后端数据库，只是前端的请求体不一样，后端的结构体不一样
func DeclarationRepo[T any](db *sql.DB, tableName string, tableName1 string, id string, declarationStruct *T) error {

	// 构建 SQL 插入语句
	fields, values, err := BuildlongQuery(declarationStruct, id)
	if err != nil {
		return fmt.Errorf("BuildlongQuery出错: %w", err)
	}
	fmt.Println("字段", fields)
	fmt.Println("值", values)

	placeholders := strings.Repeat("?, ", len(fields)) + "?"

	query := fmt.Sprintf("INSERT INTO %s (RecordID, %s, ApplyDate) VALUES (%s, DEFAULT)", tableName, strings.Join(fields, ", "), placeholders)

	// 执行 SQL 插入语句
	sqlresu, err := db.Exec(query, append([]interface{}{id}, values...)...)
	if err != nil {
		return fmt.Errorf("数据库插入语句失败: %w", err)
	}

	query1 := fmt.Sprintf("INSERT INTO %s (RecordID) VALUES (?)", tableName1)
	fmt.Println(id)
	_, err = db.Exec(query1, id)
	if err != nil {
		return err
	}

	// 打印执行结果
	fmt.Println("执行结果:", sqlresu)

	return nil
}

//商品信息是否正确 不知barcode

func ApplyProcurement(declareStruct *storagemodels.ProcurmentStruct, tablename string, tablename1 string) {
	db := DataBaseConnect()
	if db == nil {
		fmt.Println("数据库连接失败")
		return
	}
	defer db.Close() // 确保在函数结束时关闭数据库连接

	PRID, _ := GetTableCount(db, "in_declaration")
	recordid := fmt.Sprintf("PO%d", PRID)

	if err := DeclarationRepo(db, tablename, tablename1, recordid, declareStruct); err != nil {
		fmt.Println("申报失败:", err)
		return
	}
	fmt.Println("申报成功:", declareStruct)
}

func ApplyOutStorage(declareStruct *storagemodels.OutDeclaration, tablename string, tablename1 string) {
	db := DataBaseConnect()
	if db == nil {
		fmt.Println("数据库连接失败")
		return
	}
	defer db.Close() // 确保在函数结束时关闭数据库连接

	ODID, _ := GetTableCount(db, "out_declaration")
	recordid := fmt.Sprintf("OD%d", ODID)

	if err := DeclarationRepo(db, tablename, tablename1, recordid, declareStruct); err != nil {
		fmt.Println("申报失败:", err)
		return
	}
	fmt.Println("申报成功:", declareStruct)
}

func TableDataInsertHandler(w http.ResponseWriter, r *http.Request) {
	HandleCORS(w, r)
	if r.Method != http.MethodPost {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}

	tablename := r.URL.Query().Get("tablename")
	tablename1 := r.URL.Query().Get("tablename1")
	fmt.Println("tablename:", tablename)
	fmt.Println("tablename1:", tablename1)

	// 定义一个映射，将表名映射到对应的结构体类型
	typeMapping := map[string]interface{}{
		"InboundRecords":    &storagemodels.ProcurmentStruct{},
		"OutStorageRecords": &storagemodels.OutDeclaration{},
	}
	// 获取对应的结构体指针
	reqStruct, exists := typeMapping[tablename1]
	if !exists {
		http.Error(w, "不支持的表名", http.StatusBadRequest)
		return
	}

	// 使用类型断言来调用 RequestOperation
	var err error
	switch v := reqStruct.(type) {
	case *storagemodels.ProcurmentStruct:
		*v, err = RequestOperation[storagemodels.ProcurmentStruct](w, r)
	case *storagemodels.OutDeclaration:
		fmt.Println("v", *v)
		*v, err = RequestOperation[storagemodels.OutDeclaration](w, r)
		//商品条码匹配？sql语句怎么写
	default:
		http.Error(w, "不支持的请求结构体", http.StatusBadRequest)
		return
	}

	if err != nil {
		http.Error(w, "请求处理出错", http.StatusBadRequest)
		fmt.Println("请求处理出错:", err)
		return
	}

	// 根据请求的结构体类型调用相应的处理函数
	switch v := reqStruct.(type) {
	case *storagemodels.ProcurmentStruct:
		ApplyProcurement(v, tablename, tablename1)
	case *storagemodels.OutDeclaration:
		ApplyOutStorage(v, tablename, tablename1)
	}
}
