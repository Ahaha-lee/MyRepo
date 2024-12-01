package vip

import (
	vipserv "mygo/vip/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetViPInfoCon(service *vipserv.VipService) gin.HandlerFunc {
	return func(c *gin.Context) {
		vipinfo, err := service.GetVIPInfoServ(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "GetViPInfoCon()获取会员信息失败", "errormessage": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "会员信息获取成功", "vipinfo": vipinfo})
	}
}
