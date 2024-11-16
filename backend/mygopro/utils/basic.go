package shared

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
)

// cross预处理
func HandleCORS(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "PUT, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.WriteHeader(http.StatusOK)
		fmt.Println("CORS预处理出错")
	}
}

// 前端请求体
func RequestOperation[T any](w http.ResponseWriter, r *http.Request) (T, error) {
	// 1. 检查 Content-Type 头
	if r.Header.Get("Content-Type") != "application/json" {
		http.Error(w, "Unsupported Media Type", http.StatusUnsupportedMediaType)
		return *new(T), errors.New("unsupported media type")
	}
	// 2.请求大小
	// 3. 读取请求体
	body, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Println("请求体读取失败!")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return *new(T), err
	}
	defer r.Body.Close()

	// 4. 解析请求体
	var newRequest T
	if err := json.Unmarshal(body, &newRequest); err != nil {
		fmt.Println("解析请求体失败")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return *new(T), err
	}

	return newRequest, nil
}
