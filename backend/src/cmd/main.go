package main

import (
	"log"
	server "mygo/server"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	// 设置 Gin 模式为 Release
	gin.SetMode(gin.ReleaseMode)

	// 启动服务器
	if err := server.Server(); err != nil {
		log.Fatalf("无法启动服务器: %v", err)
	}
}
