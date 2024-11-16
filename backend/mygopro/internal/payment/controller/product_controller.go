package payment

import (
	"encoding/json"
	"fmt"
	"io"
	paymentmodels "mygopro/internal/payment/models"
	payserv "mygopro/internal/payment/services"
	stormodels "mygopro/internal/storage/models"
	sharedutils "mygopro/utils"
	"net/http"
)

type PaymentController struct {
	PaymentService *payserv.PaymentService
}

func NewPaymentController(paymentserv *payserv.PaymentService) *PaymentController {
	return &PaymentController{
		PaymentService: paymentserv,
	}
}

func (c *PaymentController) ProductdatainsertHandler(w http.ResponseWriter, r *http.Request) {
	sharedutils.HandleCORS(w, r)
	if r.Method != http.MethodPost {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}
	tableName := r.URL.Query().Get("tablename")
	fmt.Println("tablename:", tableName)

	// 定义一个映射，将表名映射到对应的结构体类型
	typeMapping := map[string]interface{}{
		"inventorydata":      &stormodels.InventoryStruct{},
		"productsdata":       &paymentmodels.ProductInsertStruct{},
		"salesorder":         &paymentmodels.SalesOrderStuct{},
		"purchasetable":      &paymentmodels.PurchaseTableStruct{},
		"supplierdata":       &stormodels.SuppliersStruct{},
		"product_categories": &paymentmodels.CategoryStruct{},
		"discount_rules":     &paymentmodels.DiscountStruct{},
	}
	// 获取对应的结构体指针
	reqStruct, exists := typeMapping[tableName]
	if !exists {
		http.Error(w, "不支持的表名", http.StatusBadRequest)
		return
	}

	// 使用类型断言来调用 RequestOperation
	var err error
	switch v := reqStruct.(type) {
	case *stormodels.InventoryStruct:
		fmt.Println("v", *v)
		*v, err = sharedutils.RequestOperation[stormodels.InventoryStruct](w, r)
	case *paymentmodels.ProductInsertStruct:
		fmt.Println("v", *v)
		*v, err = sharedutils.RequestOperation[paymentmodels.ProductInsertStruct](w, r)
	case *paymentmodels.SalesOrderStuct:
		*v, err = sharedutils.RequestOperation[paymentmodels.SalesOrderStuct](w, r)
	case *stormodels.SuppliersStruct:
		*v, err = sharedutils.RequestOperation[stormodels.SuppliersStruct](w, r)
	case *paymentmodels.CategoryStruct:
		*v, err = sharedutils.RequestOperation[paymentmodels.CategoryStruct](w, r)
	case *paymentmodels.DiscountStruct:
		*v, err = sharedutils.RequestOperation[paymentmodels.DiscountStruct](w, r)
		fmt.Println("v", *v)

	default:
		http.Error(w, "不支持的请求结构体", http.StatusBadRequest)
		return
	}

	if err != nil {
		http.Error(w, "请求处理出错", http.StatusBadRequest)
		fmt.Println("请求处理出错:", err)
		return
	}

	switch req := reqStruct.(type) {
	case *stormodels.InventoryStruct:
		err = payserv.ProductinfoinsertServ(r.Context(), tableName, req)
	case *paymentmodels.ProductInsertStruct:
		err = payserv.ProductinfoinsertServ(r.Context(), tableName, req)
	case *paymentmodels.SalesOrderStuct:
		err = payserv.ProductinfoinsertServ(r.Context(), tableName, req)
	case *stormodels.SuppliersStruct:
		err = payserv.ProductinfoinsertServ(r.Context(), tableName, req)
	case *paymentmodels.CategoryStruct:
		err = payserv.ProductinfoinsertServ(r.Context(), tableName, req)
	case *paymentmodels.DiscountStruct:
		fmt.Println("conreq", req)
		err = payserv.ProductinfoinsertServ(r.Context(), tableName, req)
	default:
		http.Error(w, "不支持的请求结构体", http.StatusBadRequest)
		return
	}

	if err != nil {
		http.Error(w, "插入产品信息出错", http.StatusInternalServerError)
		fmt.Println("插入产品信息出错:", err)
		return
	}
}

func (c *PaymentController) PaymentDeleteHandler(w http.ResponseWriter, r *http.Request) {
	sharedutils.HandleCORS(w, r)
	// 读取请求体
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "无法读取请求体", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	// 解析 JSON 数据
	var requestData map[string]string
	if err := json.Unmarshal(body, &requestData); err != nil {
		http.Error(w, "无效的请求数据", http.StatusBadRequest)
		return
	}

	// 从解析后的数据中获取 ID、keyword 和 tablename
	id := requestData["id"]
	keyword := requestData["keyword"]
	tableName := requestData["tablename"]

	if r.Method != http.MethodDelete {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}

	fmt.Println("ID:", id)
	fmt.Println("keyword:", keyword)
	fmt.Println("tablename:", tableName)

	err = c.PaymentService.PaymentDeleteServ(r.Context(), id, keyword, tableName)
	if err != nil {
		http.Error(w, fmt.Sprintf("paymen操作失败: %v", err), http.StatusInternalServerError)
		return
	}

}

func (c *PaymentController) UpdateProductInfHandler(w http.ResponseWriter, r *http.Request) {
	sharedutils.HandleCORS(w, r)
	if r.Method != http.MethodPut {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}

	id := r.URL.Query().Get("id")
	tablename := r.URL.Query().Get("tablename")
	keyword := r.URL.Query().Get("keyword")
	fmt.Println(id, tablename)

	// 解析请求体中的 JSON 数据
	var updates map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		http.Error(w, "请求体解析失败", http.StatusBadRequest)
		return
	}
	fmt.Println("conupdate", updates)

	if err := c.PaymentService.PaymentUpdateServ(r.Context(), tablename, id, updates, keyword); err != nil {
		http.Error(w, "更新产品信息失败: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 返回成功响应
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("更新成功"))
}

func (c *PaymentController) GetTableCountHandler(w http.ResponseWriter, r *http.Request) {
	sharedutils.HandleCORS(w, r)
	if r.Method != http.MethodGet {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}
	tablename := r.URL.Query().Get("tablename")
	fmt.Println("tablename", tablename)
	count, err := payserv.GetTableCountServ(tablename)
	if err != nil {
		fmt.Println("countserv出错")
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(count); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

}

func (c *PaymentController) ProductdatainsertHandler2(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "方法不匹配", http.StatusMethodNotAllowed)
		return
	}

	var request paymentmodels.ArrayRequest

	// 解析 JSON 请求体
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, "Failed to parse JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	// 根据请求类型调用相应的服务层处理函数
	switch request.Type {
	case "purchases":
		if len(request.Purchases) == 0 {
			http.Error(w, "未提供购买数据", http.StatusBadRequest)
			return
		}
		err = c.PaymentService.ProcessPurchases(request.Purchases)
	case "applicableItems":
		if len(request.Items) == 0 {
			http.Error(w, "未提供适用优惠商品数据", http.StatusBadRequest)
			return
		}
		err = c.PaymentService.ProcessApplicableItems(request.Items)
	default:
		http.Error(w, "指定的类型无效", http.StatusBadRequest)
		return
	}

	if err != nil {
		http.Error(w, "处理请求时出错: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "成功"})
}

func (c *PaymentController) DiscountItemsInfoHandler(w http.ResponseWriter, r *http.Request) {
	sharedutils.HandleCORS(w, r)

	if r.Method != http.MethodGet {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}

	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "缺少参数: id", http.StatusBadRequest)
		return
	}

	discountprice, err := c.PaymentService.DiscountItemsInfoServ(r.Context(), id)
	if err != nil {
		http.Error(w, "获取优惠商品信息失败: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// 设置响应头为 JSON
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // 设置状态码为 200 OK

	// 将结果编码为 JSON 并写入响应
	if err := json.NewEncoder(w).Encode(discountprice); err != nil {
		http.Error(w, "响应编码失败: "+err.Error(), http.StatusInternalServerError)
	}
}
