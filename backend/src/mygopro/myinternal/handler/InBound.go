package handler

import (
	// "database/sql"
	// "encoding/json"
	"fmt"
	"io"
	"mygopro/myinternal/myinternal/utils"
	"net/http"
)

func DeclarationHandller(w http.ResponseWriter, r *http.Request) {
	// 连接数据库
	db, err := utils.DataBaseConnect()
	if err != nil {
		http.Error(w, "数据库连接失败", http.StatusInternalServerError)
		return
	}
	defer db.Close()
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
