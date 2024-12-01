package server

import (
	"database/sql"
	storCon "mygo/storage/controllers"
	storrepo "mygo/storage/repositories"
	storserv "mygo/storage/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func StorageRoutes(server *gin.Engine, db *sql.DB) {
	// 创建 StorageRepository 实例
	repo := storrepo.NewStorageRepository(db)
	// 创建 StorageService 实例
	services := storserv.NewStorageService(repo)

	storageGroup := server.Group("/api/storage")
	{
		storageGroup.POST("/:operation", storCon.DeclarationCon(db))
		storageGroup.GET("/:action/:search_id", storCon.GetDeclarationInfoCon(services)) //申请表

		storageGroup.GET("/cg/operate", storCon.GetCGProgressInfoCon(services)) //采购操作页面
		storageGroup.PUT("/cg/:operation/:update_id", storCon.CaiGouOperationCon(db))
		storageGroup.GET("/cg/records/:search_id", storCon.GetInboundRecordsCon(services))             //入库记录查询
		storageGroup.GET("/ck/records/:search_id", storCon.GetOutboundRecordsCon(services))            //出库记录查询
		storageGroup.GET("/:action/record/status_:search_id", storCon.GetOperationStatusCon(services)) // 操作状态查询

		storageGroup.GET("/ck/operate", storCon.GetCKProgressInfoCon(services)) //出库操作页面
		storageGroup.PUT("/ck/:operation/:update_id", storCon.ChuKuOperationCon(db))

	}
}

func StorageRoutesGorm(server *gin.Engine, db *gorm.DB) {
	{

	}
}
