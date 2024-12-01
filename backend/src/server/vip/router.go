package server

import (
	"database/sql"
	vip "mygo/vip/controllers"
	vipRepo "mygo/vip/repositories"
	vipServ "mygo/vip/service"

	"github.com/gin-gonic/gin"
)

func VipRoutes(server *gin.Engine, db *sql.DB) {
	// 创建 VipRepository 实例
	repo := vipRepo.NewVipRepository(db)
	// 创建 VipService 实例
	services := vipServ.NewVipService(repo)

	vipGroup := server.Group("/api/vip")
	{
		vipGroup.GET("/list", vip.GetViPInfoCon(services))         //会员全部信息
		vipGroup.POST("", vip.NewVip(services))                    // 新增会员
		vipGroup.GET("/:search_id", vip.SearchVip(services))       // 查询会员
		vipGroup.PUT("/:update_id", vip.UpdateVipPoints(services)) // 修改会员积分
		vipGroup.DELETE("/:delete_id", vip.DeleteVIP(services))    // 删除会员
	}
}
