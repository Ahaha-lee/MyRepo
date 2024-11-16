package storage

import (
	"encoding/json"
	"fmt"
	"io"
	storagemodels "mygopro/internal/storage/models"
	storageser "mygopro/internal/storage/service"
	sharedutils "mygopro/utils"
	"net/http"
)

// list页面 获取inbounreords中的id号,后接三个操作 check putin examine
//直接到list页面，点击按钮（后端提交申请更新表中数据）跳转到页面，

type StorageController struct {
	Storageservice *storageser.StorageService
}

func NewStorageController(storserv *storageser.StorageService) *StorageController {
	return &StorageController{
		Storageservice: storserv,
	}
}

// 采购申请表
func (c *StorageController) CaiGouListHandler(w http.ResponseWriter, r *http.Request) {
	sharedutils.HandleCORS(w, r)
	if r.Method != http.MethodGet {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}

	// 获取查询参数 tablename
	tablename := r.URL.Query().Get("tablename")
	if tablename == "" {
		http.Error(w, "tablename 参数缺失", http.StatusBadRequest)
		return
	}

	// 调用服务层获取数据
	titles, recordIDs, err := c.Storageservice.ShowList(r.Context(), tablename)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// 将结果转换为 JSON 格式并返回
	responseData := struct {
		Titles    []string `json:"titles"`
		RecordIDs []string `json:"record_ids"`
	}{
		Titles:    titles,
		RecordIDs: recordIDs,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(responseData); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (c *StorageController) TableInfoHandler(w http.ResponseWriter, r *http.Request) {
	sharedutils.HandleCORS(w, r)
	if r.Method != http.MethodGet {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}
	recordid := r.URL.Query().Get("recordid")
	tablename := r.URL.Query().Get("tablename")
	recorddata, err := c.Storageservice.ShowTableInfo(r.Context(), recordid, tablename)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(recorddata); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (c *StorageController) CGOperationHandler(w http.ResponseWriter, r *http.Request) {
	sharedutils.HandleCORS(w, r)
	if r.Method != http.MethodPost {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}

	// 从请求中获取 action 和 recordid 参数
	action := r.URL.Query().Get("action")
	fmt.Println("2", action)
	recordID := r.URL.Query().Get("recordID")
	switch action {
	case "check":
		operationStruct, _ := sharedutils.RequestOperation[storagemodels.CaiGouCheckStruct](w, r)
		c.Storageservice.GaiGouCheck(r.Context(), recordID, operationStruct)
	case "putin":
		operationStruct, _ := sharedutils.RequestOperation[storagemodels.CaiGouPutintruct](w, r)
		c.Storageservice.GaiGouPutin(r.Context(), recordID, operationStruct)
	case "examine":
		operationStruct, _ := sharedutils.RequestOperation[storagemodels.CaiGouExamineStruct](w, r)
		fmt.Println(operationStruct)
		c.Storageservice.GaiGouExamine(r.Context(), recordID, operationStruct)
	default:
		http.Error(w, "Invalid operation type", http.StatusBadRequest)
		return
	}

}
func (c *StorageController) OutOperationHandler(w http.ResponseWriter, r *http.Request) {
	sharedutils.HandleCORS(w, r)
	if r.Method != http.MethodPost {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}

	// 从请求中获取 action 和 recordid 参数
	action := r.URL.Query().Get("action")
	fmt.Println(action)
	recordID := r.URL.Query().Get("recordID")
	switch action {
	case "outcheck":
		operationStruct, _ := sharedutils.RequestOperation[storagemodels.OutCheckStruct](w, r)
		fmt.Println("operationout", operationStruct)
		c.Storageservice.OutCheck(r.Context(), recordID, operationStruct)
	case "out":
		operationStruct, _ := sharedutils.RequestOperation[storagemodels.OutStorageStruct](w, r)
		fmt.Println("operationout", operationStruct)
		c.Storageservice.OutStorage(r.Context(), recordID, operationStruct)
	default:
		http.Error(w, "Invalid outoperation type", http.StatusBadRequest)
		return
	}

}

func (c *StorageController) GetOperationInfoHandler(w http.ResponseWriter, r *http.Request) {
	sharedutils.HandleCORS(w, r)
	if r.Method != http.MethodGet {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}

	action := r.URL.Query().Get("action")
	fmt.Println("1", action)
	recordID := r.URL.Query().Get("recordID")
	var record interface{}
	switch action {
	case "check":
		operationStruct := &storagemodels.CaiGouCheckStruct{}
		record, _ = storageser.OperateInfo(r.Context(), action, recordID, operationStruct)
	case "putin":
		operationStruct := &storagemodels.CaiGouPutintruct{}
		record, _ = storageser.OperateInfo(r.Context(), action, recordID, operationStruct)
	case "examine":
		operationStruct := &storagemodels.CaiGouExamineStruct{}
		fmt.Println("operation", operationStruct)
		record, _ = storageser.OperateInfo(r.Context(), action, recordID, operationStruct)
	case "outcheck":
		operationStruct := &storagemodels.OutCheckStruct{}
		fmt.Println(operationStruct)
		record, _ = storageser.OperateInfo(r.Context(), action, recordID, operationStruct)
	case "out":
		operationStruct := &storagemodels.OutStorageStruct{}
		record, _ = storageser.OperateInfo(r.Context(), action, recordID, operationStruct)
	default:
		http.Error(w, "Invalid operation type", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(record); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (c *StorageController) UpdateKucunNumHandler(w http.ResponseWriter, r *http.Request) {
	sharedutils.HandleCORS(w, r)
	if r.Method != http.MethodPut {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}
	id := r.URL.Query().Get("id")
	tablename := r.URL.Query().Get("tablename")
	keyword := r.URL.Query().Get("keyword")
	action := r.URL.Query().Get("action")
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "无法读取请求体", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	// 解析 JSON 数据
	var requestData float64
	if err := json.Unmarshal(body, &requestData); err != nil {
		http.Error(w, "无效的请求数据", http.StatusBadRequest)
		return
	}
	err = c.Storageservice.UpdatekucunNumServ(r.Context(), tablename, requestData, keyword, id, action)
	if err != nil {
		http.Error(w, "更新数量信息失败", http.StatusInternalServerError)
		return
	}

}
