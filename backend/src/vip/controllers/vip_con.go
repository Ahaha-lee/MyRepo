package vip

import (
	vipserv "mygo/vip/service"
	"net/http"
	"strconv"

	vipmodels "mygo/vip/models"

	"github.com/gin-gonic/gin"
)

func GetViPInfoCon(service *vipserv.VipService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("search_id"))
		page, _ := strconv.Atoi(c.Param("page"))

		vipinfo, total, err := service.GetVIPInfoServ(c, id, page)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "GetViPInfoCon()获取会员信息失败", "errormessage": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "会员信息获取成功", "vipinfo": vipinfo, "total_num": total})
	}
}

func CRUDForVipGradeRules(service *vipserv.VipGormService) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "POST" {
			var input []vipmodels.GradeStruct
			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "CRUDForVipGradeRules() 绑定数据失败", "errormessage": err.Error()})
				return
			}

			err := service.InsertNewGradesRuleServ(c, input)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "CRUDForVipGradeRules() 插入数据失败", "errormessage": err.Error()})
				return
			}

			// 插入成功，返回成功响应
			c.JSON(http.StatusCreated, gin.H{"message": "插入数据成功"})
			return
		} else if c.Request.Method == "GET" {
			grades, rule_id, err := service.GetNewGradesRuleServ(c)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "CRUDForVipGradeRules() 获取数据失败", "errormessage": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": "获取数据成功", "data": grades, "rule_id": rule_id})
		}
	}
}
