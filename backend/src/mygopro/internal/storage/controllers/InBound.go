package storage

// import (
// 	"encoding/json"
// 	"fmt"
// 	"io"
// 	"mygopro/myinternal/model"
// 	"mygopro/myinternal/utils"
// 	"net/http"
// )

// // 申报表处理程序

// func DeclareCheckHandler(w http.ResponseWriter, r *http.Request) {
// 	// 获取数据库连接
// 	db, err := utils.DataBaseConnect()
// 	if err != nil {
// 		fmt.Println("数据库连接失败:", err)
// 		http.Error(w, "数据库连接失败", http.StatusInternalServerError)
// 		return
// 	}
// 	defer db.Close()

// 	// 读取请求体
// 	body, err := io.ReadAll(r.Body)
// 	if err != nil {
// 		http.Error(w, "读取请求体失败", http.StatusBadRequest)
// 		return
// 	}
// 	fmt.Println("body", body)

// 	// 尝试解析为不同的结构体类型
// 	var newStruct model.ChecktodeclarStruct
// 	if err := json.Unmarshal(body, &newStruct); err != nil {
// 		http.Error(w, "解析请求体失败", http.StatusBadRequest)
// 		return
// 	}
// 	fmt.Println(newStruct)
// 	recordid := "PR4"
// 	// 调用 DeclareOperationFunc 插入数据
// 	err = utils.DeclareOperationFunc(db, &newStruct, recordid)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	// 返回成功响应
// 	w.WriteHeader(http.StatusCreated)
// }

// func DeclarePutinHandler(w http.ResponseWriter, r *http.Request) {
// 	// 获取数据库连接
// 	db, err := utils.DataBaseConnect()
// 	if err != nil {
// 		fmt.Println("数据库连接失败:", err)
// 		http.Error(w, "数据库连接失败", http.StatusInternalServerError)
// 		return
// 	}
// 	defer db.Close()

// 	// 读取请求体
// 	body, err := io.ReadAll(r.Body)
// 	if err != nil {
// 		http.Error(w, "读取请求体失败", http.StatusBadRequest)
// 		return
// 	}
// 	fmt.Println("body", body)

// 	// 尝试解析为不同的结构体类型
// 	var newStruct model.PutIntodeclarStruct
// 	if err := json.Unmarshal(body, &newStruct); err != nil {
// 		http.Error(w, "解析请求体失败", http.StatusBadRequest)
// 		return
// 	}
// 	fmt.Println(newStruct)

// 	recordid := "PR1"
// 	// 调用 DeclareOperationFunc 插入数据
// 	err = utils.DeclareOperationFunc(db, &newStruct, recordid)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	// 返回成功响应
// 	w.WriteHeader(http.StatusCreated)
// }

// func DeclareExamineHandler(w http.ResponseWriter, r *http.Request) {
// 	// 获取数据库连接
// 	db, err := utils.DataBaseConnect()
// 	if err != nil {
// 		fmt.Println("数据库连接失败:", err)
// 		http.Error(w, "数据库连接失败", http.StatusInternalServerError)
// 		return
// 	}
// 	defer db.Close()

// 	// 读取请求体
// 	body, err := io.ReadAll(r.Body)
// 	if err != nil {
// 		http.Error(w, "读取请求体失败", http.StatusBadRequest)
// 		return
// 	}
// 	fmt.Println("body", body)

// 	// 尝试解析为不同的结构体类型
// 	var newStruct model.ExaminetodeclarStruct
// 	if err := json.Unmarshal(body, &newStruct); err != nil {
// 		http.Error(w, "解析请求体失败", http.StatusBadRequest)
// 		return
// 	}
// 	fmt.Println(newStruct)

// 	recordid := "PR1"
// 	// 调用 DeclareOperationFunc 插入数据
// 	err = utils.DeclareOperationFunc(db, &newStruct, recordid)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	// 返回成功响应
// 	w.WriteHeader(http.StatusCreated)
// }
