package server

import (
	"log"
	login "mygo/server/login"
	vip "mygo/server/vip"
	"time"

	"database/sql"
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	_ "github.com/mattn/go-sqlite3"
)

func DataBaseConnect() *sql.DB {
	dsn := "root:123456@tcp(127.0.0.1:3306)/dingguaguadb"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		fmt.Println("数据库连接失败", err)
		return nil
	}

	// 测试连接是否成功
	if err := db.Ping(); err != nil {
		return nil
	}

	return db
}
func Server() error {
	// 连接数据库
	db := DataBaseConnect()
	defer db.Close()

	// 服务器
	server := gin.Default()

	// 自定义 CORS 配置
	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},                   // 允许的源
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}, // 允许的方法
		AllowHeaders:     []string{"Authorization", "Content-Type"},           // 允许的请求头
		ExposeHeaders:    []string{"Content-Length"},                          // 允许暴露的响应头
		AllowCredentials: true,                                                // 是否允许带上凭证
		MaxAge:           12 * time.Hour,                                      // 预检请求的缓存时间
	}

	// 使用自定义 CORS 中间件
	server.Use(cors.New(corsConfig))

	// 路由
	login.LoginRoutes(server, db) // 登录注册路由
	vip.VipRoutes(server, db)     // 会员模块

	// 启动服务器
	if err := server.Run(":8080"); err != nil {
		log.Fatalf("无法启动服务器: %v", err)
		return err
	}

	return nil
}
