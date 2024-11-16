package vip

import (
	"fmt"
	vipmodels "mygo/vip/models"
	vipserv "mygo/vip/service"
	"strings"

	"net/http"

	"github.com/gin-gonic/gin"
)

// 有接受者 方法
type VipController struct {
	vipService *vipserv.VipService
}

func NewVipController(vipService *vipserv.VipService) *VipController {
	return &VipController{
		vipService: vipService,
	}
}

// 会员信息查询
func SearchVip(service *vipserv.VipService) gin.HandlerFunc {
	return func(c *gin.Context) {
		serch_id := strings.TrimSpace(c.Param("search_id"))

		vipmember, err := service.GetVipInfoServ(c, serch_id)
		if err != nil {
			fmt.Println(err.Error())
			c.JSON(http.StatusNotFound, gin.H{
				"error":        "查询失败",
				"errormessage": err.Error(),
			})
			return
		}
		fmt.Println("serchvipstruct", vipmember)

		c.JSON(http.StatusOK, gin.H{"message": "会员信息查询成功", "vip": vipmember})
	}
}

// 会员积分修改
func UpdateVipPoints(service *vipserv.VipService) gin.HandlerFunc {
	return func(c *gin.Context) {
		update_id := strings.TrimSpace(c.Param("update_id"))
		input := vipmodels.UpdatePointsRequest{}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "解析请求失败", "errormessage": err.Error()})
			return
		}
		response, err := service.UpdatePointsInfoServ(c, update_id, input.Value, input.UpdateNowPoints, input.UpdateUsedPoints)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "更新会员积分失败", "errormessage": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "会员积分修改成功", "vip": response})

	}
}
