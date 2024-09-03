package main

import (
    "fmt"
    "net/http"
)

// 处理根路径的请求
func helloHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World!") // 向客户端发送响应
}

// 主函数
func main() {
    http.HandleFunc("/", helloHandler) // 设置路由
    fmt.Println("Starting server on :8080") // 打印服务器启动信息
    if err := http.ListenAndServe(":8080", nil); err != nil { // 启动服务器
        fmt.Println("Error starting server:", err)
    }
}
