package server

import (
	"log"
	"time"

	"database/sql"
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	login "mygo/server/login"
	order "mygo/server/order"
	payment "mygo/server/payment"
	storage "mygo/server/storage"
	system "mygo/server/system"
	vip "mygo/server/vip"
	stormodels "mygo/storage/models"
	storrepo "mygo/storage/repositories"
)

// 连接普通 SQL 数据库并检查连接
func DataBaseConnect() *sql.DB {
	dsn := "root:123456@tcp(127.0.0.1:3306)/dingguaguadb"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Printf("数据库连接失败: %v\n", err)
		return nil
	}

	if err := db.Ping(); err != nil {
		log.Printf("数据库连接测试失败: %v\n", err)
		return nil
	}

	return db
}

// 连接 Gorm 数据库并检查连接
func DataBaseConnectGorm() *gorm.DB {
	dsn := "root:123456@tcp(127.0.0.1:3306)/dingguaguadb?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("DataBaseConnectGorm 失败: %v\n", err)
		return nil
	}

	// 获取底层 *sql.DB 并检查连接
	sqlDB, err := db.DB()
	if err != nil {
		log.Printf("获取底层 *sql.DB 失败: %v\n", err)
		return nil
	}
	if err := sqlDB.Ping(); err != nil {
		log.Printf("Gorm 数据库连接测试失败: %v\n", err)
		return nil
	}

	return db
}

// 初始化 CORS 配置
func initCORS() cors.Config {
	return cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
}

// 初始化缓存配置
func initCacheConfig() stormodels.CacheConfig {
	return stormodels.CacheConfig{
		MaxSize:         1000,
		CleanupInterval: time.Hour * 24,
		MinAccessCount:  5,
		ExpirationTime:  24 * time.Hour,
	}
}

func Server() error {
	// 连接数据库
	db := DataBaseConnect()
	defer func() {
		if err := db.Close(); err != nil {
			log.Printf("关闭普通数据库连接失败: %v\n", err)
		}
	}()

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
	defer func() {
		if err := dbsql.Close(); err != nil {
			log.Printf("关闭 Gorm 底层数据库连接失败: %v\n", err)
		}
	}()

	// 服务器
	server := gin.Default()

	// 使用自定义 CORS 中间件
	server.Use(cors.New(initCORS()))

	// 初始化缓存
	cacheConfig := initCacheConfig()
	if err := storrepo.InitCache(dbGorm, cacheConfig); err != nil {
		log.Fatalf("初始化缓存失败: %v\n", err)
	}

	// 路由
	login.LoginRoutes(server, db)
	vip.VipRoutes(server, db)
	vip.VipRoutesGorm(server, dbGorm)
	storage.StorageRoutes(server, db)
	storage.StorageRoutesGorm(server, dbGorm)
	payment.PaymentRoutes(server, dbGorm)
	system.Systemrouteres(server, dbGorm)
	order.OrderRoutes(server, dbGorm)

	// 启动服务器
	if err := server.Run(":8081"); err != nil {
		log.Fatalf("无法启动服务器: %v\n", err)
		return err
	}

	return nil
}
