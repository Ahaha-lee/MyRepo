package server

import (
	"database/sql"
	vip "mygo/vip/controllers"
	vipRepo "mygo/vip/repositories"
	vipServ "mygo/vip/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func VipRoutes(server *gin.Engine, db *sql.DB) {
	// 创建 VipRepository 实例
	repo := vipRepo.NewVipRepository(db)
	// 创建 VipService 实例
	services := vipServ.NewVipService(repo)

	vipGroup := server.Group("/api/vip")
	{
		vipGroup.GET("/:search_id/:page", vip.GetViPInfoCon(services)) //会员信息
		vipGroup.POST("/insert", vip.NewVip(services))                 // 新增会员
		vipGroup.PUT("/:update_id", vip.UpdateVipPoints(services))     // 修改会员积分
		vipGroup.DELETE("/:delete_id", vip.DeleteVIP(services))        // 删除会员

	}
}

func VipRoutesGorm(server *gin.Engine, db *gorm.DB) {

	repo := vipRepo.NewVipGormRepository(db)
	services := vipServ.NewVipGormService(repo)

	vipgormGroup := server.Group("/api/vip_grades")
	{
		vipgormGroup.POST("/insert", vip.CRUDForVipGradeRules(services)) /// 会员等级规则
		vipgormGroup.GET("/getinfo", vip.CRUDForVipGradeRules(services))
	}
}
