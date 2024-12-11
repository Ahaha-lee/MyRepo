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
		storageGroup.GET("/:action/:search_id/:page", storCon.GetDeclarationInfoCon(services)) //申请表
		storageGroup.PUT("/:action/:update_id", storCon.CGDeclarationUpdateCon(services))      //修改申请表单

		storageGroup.GET("/cg/operate/:page", storCon.GetCGProgressInfoCon(services))            //采购操作页面
		storageGroup.PUT("/cg/:operation/:update_id", storCon.CaiGouOperationCon(db))            //审核 入库 验收
		storageGroup.GET("/cg/records/:search_id/:page", storCon.GetInboundRecordsCon(services)) //入库记录查询

		storageGroup.GET("/:action/record/status_:search_id/:page", storCon.GetOperationStatusCon(services)) // 操作状态查询

		storageGroup.GET("/ck/operate/:page", storCon.GetCKProgressInfoCon(services))             //出库操作页面
		storageGroup.PUT("/ck/:operation/:update_id", storCon.ChuKuOperationCon(db))              //审核 出库
		storageGroup.GET("/ck/records/:search_id/:page", storCon.GetOutboundRecordsCon(services)) //出库记录查询

	}
}

func StorageRoutesGorm(server *gin.Engine, db *gorm.DB) {
	// 创建 StorageGormRepository 实例
	repo := storrepo.NewStorageGormRepository(db)
	// 创建 StorageGormService 实例
	services := storserv.NewStorageGormService(repo)

	storageGroupPro := server.Group("/api/storage")
	{
		// 商品信息的增删改查
		storageGroupPro.POST("/product/:action", storCon.CRUDForProductsCon(services))
		storageGroupPro.GET("/product/:search_id/:page", storCon.CRUDForProductsCon(services))
		storageGroupPro.DELETE("/product/:delete_id", storCon.CRUDForProductsCon(services))
		storageGroupPro.PUT("/product/:update_id", storCon.CRUDForProductsCon(services))

		// 商品种类信息的增删改查
		storageGroupPro.POST("/category/insert", storCon.CRUDForCatgoryCon(services))
		storageGroupPro.GET("/category/:search_id/:page", storCon.CRUDForCatgoryCon(services))
		storageGroupPro.DELETE("/category/:delete_id", storCon.CRUDForCatgoryCon(services))
		storageGroupPro.PUT("/category/:update_id", storCon.CRUDForCatgoryCon(services))

		// 库存商品信息
		storageGroupPro.GET("/inventory/:search_id/:page", storCon.CRUDForInventoryCon(services))
		storageGroupPro.PUT("/inventory/:update_id", storCon.CRUDForInventoryCon(services))
		storageGroupPro.DELETE("/inventory/:delete_id", storCon.CRUDForInventoryCon(services))

	}
}
