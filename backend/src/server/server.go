package server

import (
	"log"
	login "mygo/server/login"
	payment "mygo/server/payment"
	storage "mygo/server/storage"
	vip "mygo/server/vip"
	stormodels "mygo/storage/models"
	storrepo "mygo/storage/repositories"
	"time"

	"database/sql"
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"gorm.io/driver/mysql" // 确保正确导入 mysql 驱动
	"gorm.io/gorm"
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

func DataBaseConnectGorm() *gorm.DB {
	dsn := "root:123456@tcp(127.0.0.1:3306)/dingguaguadb?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Println("DataBaseConnectGorm", err)
		return nil
	}
	return db
}
func Server() error {
	// 连接数据库
	db := DataBaseConnect()
	defer db.Close()

	// 试用 Gorm
	dbGorm := DataBaseConnectGorm()
	if dbGorm == nil {
		return fmt.Errorf("dbGorm无法连接到数据库")
	}

	// 获取底层的 *sql.DB 并检查错误
	dbsql, err := dbGorm.DB()
	if err != nil {
		return fmt.Errorf("获取底层 *sql.DB 失败: %v", err)
	}
	defer dbsql.Close()

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

	// 初始化缓存配置
	cacheConfig := stormodels.CacheConfig{
		MaxSize:         1000,           // 最多缓存1000个商品
		CleanupInterval: time.Hour * 24, // 每24小时清理一次
		MinAccessCount:  5,              // 最少访问5次才保留
		ExpirationTime:  24 * time.Hour, // 24小时未访问则过期
	}

	// 初始化缓存，这里会触发：
	// 1. preloadHotProducts() - 预加载热门商品
	// 2. 启动清理协程 - 定期执行 CleanCache()
	if err := storrepo.InitCache(dbGorm, cacheConfig); err != nil {
		log.Fatal(err)
	}
	// 使用自定义 CORS 中间件
	server.Use(cors.New(corsConfig))

	// 路由
	login.LoginRoutes(server, db)             // 登录注册路由
	vip.VipRoutes(server, db)                 // 会员模块
	vip.VipRoutesGorm(server, dbGorm)         //会员模块2.0
	storage.StorageRoutes(server, db)         //库存模块
	storage.StorageRoutesGorm(server, dbGorm) //库存模块2.0
	payment.PaymentRoutes(server, dbGorm)

	// 启动服务器
	if err := server.Run(":8081"); err != nil {
		log.Fatalf("无法启动服务器: %v", err)
		return err
	}

	return nil
}
