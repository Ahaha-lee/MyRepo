package vip

import (
	"fmt"
	vipmodels "mygo/vip/models"
	vipserv "mygo/vip/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

// 新增会员
func NewVip(service *vipserv.VipService) gin.HandlerFunc {
	return func(c *gin.Context) {
		input := vipmodels.VIP{}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		err := service.RegistervipServ(c, &input)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "会员注册失败", "errormessage": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"message": "会员注册成功", "vip": input})
	}

}

// 会员删除
func DeleteVIP(service *vipserv.VipService) gin.HandlerFunc {
	return func(c *gin.Context) {
		vipPhone := c.Param("delete_id")
		fmt.Println("delete_id", vipPhone)
		_, err := service.DeleteVIPServ(c, vipPhone)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "注销会员失败", "errormessage": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "注销会员成功"})

	}

}
