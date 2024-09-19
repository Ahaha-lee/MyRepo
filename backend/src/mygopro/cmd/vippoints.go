package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

// 为什么chat每次都要json格式一下？

type VIP struct {
	VIPID      string
	FirstName  string
	LastName   string
	JoinDate   string
	Phone      string
	NowPoints  float64
	UsedPoints float64
}

// 修修积分请求体结构体
type UpdatePointsRequest struct {
	Value            int    `json:"value"`            // 要增加的点数
	Phone            string `json:"phone"`            // 用户的手机号
	UpdateNowPoints  bool   `json:"updateNowPoints"`  // 是否更新NowPoints
	UpdateUsedPoints bool   `json:"updateUsedPoints"` // 是否更新UsedPoints
}

// 自定义解析json方法
func (m *UpdatePointsRequest) UnmarshalJSON(data []byte) error {
	// UpdatePointsRequest结构体的副本 Alias
	type Alias UpdatePointsRequest
	// aux所以结构体，Alias类型的结构体，
	aux := &struct {
		*Alias
	}{
		// 接收者 m 转换为 Alias 类型，并赋值给 aux 的 Alias 字段。
		Alias: (*Alias)(m),
	}
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}
	return nil
}

// 通用的数据库连接函数
func ConnectDB() (*sql.DB, error) {
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

// 查询单个VIP会员
func GetUser(db *sql.DB, vipphone string) (*VIP, error) {
	var vip VIP
	//QueryRow 这是返回单条,表中有多条Query
	err := db.QueryRow(
		`SELECT VIPID, FirstName, LastName, JoinDate,Phone, NowPoints, UsedPoints FROM vipmembersdata WHERE Phone = ?`,
		vipphone,
	).Scan(
		&vip.VIPID,
		&vip.FirstName,
		&vip.LastName,
		&vip.JoinDate,
		&vip.Phone,
		&vip.NowPoints,
		&vip.UsedPoints,
	)
	if err != nil {
		return nil, err
	}
	return &vip, nil
}

// 单个会员查询处理程序
func VipHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Origin", "*")             // 允许所有来源
		w.Header().Set("Access-Control-Allow-Methods", "PUT, OPTIONS") // 允许的请求方法
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type") // 允许的请求头
		w.WriteHeader(http.StatusOK)                                   // 返回 200 OK
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}

	vipphone := r.URL.Query().Get("vipphone")
	if vipphone == "" {
		http.Error(w, "缺少vipphone参数", http.StatusBadRequest)
		return
	}

	// 连接数据库
	db, err := ConnectDB()
	if err != nil {
		http.Error(w, "数据库连接失败", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	// 查询
	vip, err := GetUser(db, vipphone)
	if err != nil {
		http.Error(w, "查询用户失败", http.StatusInternalServerError)
		return
	}

	// 返回 JSON 响应  干嘛用的？
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(vip)
}

// 修改VIP会员信息
func UpdateVIP(db *sql.DB, phone string, value int, updateNowPoints bool, updateUsedPoints bool) (int64, error) {
	// 参数验证
	if phone == "" {
		return 0, fmt.Errorf("会员电话号码不能为空")
	}
	var query string
	var args []interface{}
	// 根据需要构建 SQL 查询
	if updateNowPoints && !updateUsedPoints {

		query = `UPDATE vipmembersdata SET NowPoints = NowPoints + ? WHERE Phone = ?`
		args = []interface{}{value, phone}

	} else if updateUsedPoints && !updateNowPoints {

		query = `UPDATE vipmembersdata SET NowPoints = Nowpoints - ?, UsedPoints = UsedPoints + ? WHERE Phone= ?`
		args = []interface{}{value, value, phone}

	} else {
		return 0, fmt.Errorf("请确定修改字段。")
	}
	fmt.Printf("即将执行的 SQL: %s, 参数: %v\n", query, args)

	result, err := db.Exec(query, args...)
	if err != nil {
		log.Printf("更新VIP信息失败: %v", err)
		return 0, err
	}

	// 获取受影响的行数
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Printf("获取受影响的行数失败: %v", err)
		return 0, err
	}

	return rowsAffected, nil
}

// 会员积分修改处理程序
func UpdateVIPHandler(w http.ResponseWriter, r *http.Request) {
	// 处理 CORS 预检请求
	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "PUT, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.WriteHeader(http.StatusOK)
		return
	}

	fmt.Println("请求方法:", r.Method)
	fmt.Println("URL", r.URL)
	if r.Method != http.MethodPut {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}

	// 连接数据库
	db, err := ConnectDB()
	if err != nil {
		http.Error(w, "数据库连接失败", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	var req UpdatePointsRequest
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "读取请求体失败", http.StatusBadRequest)
		return
	}

	if err := req.UnmarshalJSON(body); err != nil {
		http.Error(w, "解析请求体失败", http.StatusBadRequest)
		return
	}
	existingVIP, err := GetUser(db, req.Phone)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "没有找到指定的 VIP", http.StatusNotFound)
			return
		}
		http.Error(w, "查询 VIP 信息失败", http.StatusInternalServerError)
		return
	}

	// 更新VIP信息
	fmt.Printf("修改的VIP信息: %+v\n", existingVIP)
	rowsAffected, err := UpdateVIP(db, req.Phone, req.Value, req.UpdateNowPoints, req.UpdateUsedPoints)
	if err != nil {
		http.Error(w, "更新VIP信息失败", http.StatusInternalServerError)
		fmt.Printf("获取受影响行数失败: %v", err)
		return
	}
	fmt.Printf("受影响的行数: %d\n", rowsAffected)
	if rowsAffected == 0 {
		http.Error(w, "没有找到要更新的VIP", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
