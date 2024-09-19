package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

// RegiVIP 结构体，用于保存 VIP 会员信息
type RegiVIP struct {
	FirstName   string `json:"firstname"`
	LastName    string `json:"lastname"`
	Phone       string `json:"phone"`
	JoinDate    string `json:"joindate"`
	RegiHandler string `json:"regihandler"`
}

// 自定义解析json方法
func (m *RegiVIP) UnmarshalJSON(data []byte) error {
	// UpdatePointsRequest结构体的副本 Alias
	type Alias RegiVIP
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

// 插入新会员信息
func InsertData(db *sql.DB, newvip RegiVIP) (string, error) {
	// 获取表中记录数
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM vipmembersdata").Scan(&count)
	if err != nil {
		return "", err
	}

	// 生成新的 VIPID
	vipid := fmt.Sprintf("V%d", count+1)
	query := "INSERT INTO vipmembersdata (VIPID, FirstName, LastName,JoinDate, Phone,NowPoints, UsedPoints,RegiHandler) VALUES (?, ?, ?, ?,?,?, ?, ?)"
	_, err = db.Exec(query, vipid, newvip.FirstName, newvip.LastName, newvip.JoinDate, newvip.Phone, 0, 0, newvip.RegiHandler)
	if err != nil {
		return "", err
	}

	return vipid, nil
}

// 存入新会员信息处理程序
func RegisterVipHandler(w http.ResponseWriter, r *http.Request) {
	// 连接数据库
	db, err := ConnectDB()
	if err != nil {
		http.Error(w, "数据库连接失败", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	var newvip RegiVIP
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "读取请求体失败", http.StatusBadRequest)
		return
	}

	if err := newvip.UnmarshalJSON(body); err != nil {
		http.Error(w, "解析请求体失败", http.StatusBadRequest)
		return
	}
	fmt.Println("请求体", newvip)

	// 调用插入函数
	vipid, err := InsertData(db, newvip)
	if err != nil {
		http.Error(w, "插入数据失败", http.StatusInternalServerError)
		return
	}

	// 返回成功信息
	fmt.Fprintf(w, "插入成功，ID: %s\n", vipid)
}

// 删除会员信息
func DeleteData(db *sql.DB, vipPhone string) (int64, error) {
	query := "DELETE FROM vipmembersdata WHERE Phone= ?"
	result, err := db.Exec(query, vipPhone)
	if err != nil {
		return 0, err
	}

	// 获取受影响的行数
	rowsAffected, err := result.RowsAffected()

	if err != nil {
		return 0, err
	}

	return rowsAffected, nil
}

// 处理删除会员信息的请求
func DeleteVIPHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "不支持的请求方法", http.StatusMethodNotAllowed)
		return
	}

	// 从请求中获取 VIPID
	vipPhone := r.URL.Query().Get("vipphone")
	if vipPhone == "" {
		http.Error(w, "缺少 VIPPHONE", http.StatusBadRequest)
		return
	}

	// 连接数据库
	db, err := ConnectDB()
	if err != nil {
		http.Error(w, "数据库连接失败", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	// 调用删除函数
	rowsAffected, err := DeleteData(db, vipPhone)
	fmt.Println("注销会员电话", vipPhone)
	fmt.Println("受影响的行数", rowsAffected)
	if err != nil {
		http.Error(w, "删除数据失败", http.StatusInternalServerError)
		return
	}

	if rowsAffected == 0 {
		http.Error(w, "未找到要删除的记录", http.StatusNotFound)
		return
	}

	// 返回成功信息
	fmt.Fprintf(w, "删除成功，受影响的行数: %d\n", rowsAffected)
}
