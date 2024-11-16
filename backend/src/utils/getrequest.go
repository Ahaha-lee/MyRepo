package utils
import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
)

// 前端请求体
func RequestOperation[T any](w http.ResponseWriter, r *http.Request) (T, error) {
	// 1. 检查 Content-Type 头
	if r.Header.Get("Content-Type") != "application/json" {
		http.Error(w, "Unsupported Media Type", http.StatusUnsupportedMediaType)
		return *new(T), errors.New("unsupported media type")
	}
	// 2. 读取请求体
	body, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Println("请求体读取失败!")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return *new(T), err
	}
	defer r.Body.Close()

	// 3. 解析请求体
	var newRequest T
	if err := json.Unmarshal(body, &newRequest); err != nil {
		fmt.Println("解析请求体失败")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return *new(T), err
	}

	return newRequest, nil
}
