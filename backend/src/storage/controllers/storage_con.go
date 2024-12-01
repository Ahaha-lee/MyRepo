package storage

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	stormodels "mygo/storage/models"
	storserv "mygo/storage/service"

	"github.com/gin-gonic/gin"
)

// 申请表提交
func DeclarationCon(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		operation := c.Param("operation")
		fmt.Println("Action:", operation)
		if operation == "cgsb" {
			input := stormodels.ProcurmentStruct{}
			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误", "errormessage": err.Error()})
				return
			}
			err := storserv.DeclarationServ(db, &input, "procurement")
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "申请表提交失败", "errormessage": err.Error()})
				return
			}

		} else if operation == "cksb" {
			input := stormodels.OutDeclaration{}
			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "请求体错误", "errormessage": err.Error()})
				return
			}
			err := storserv.DeclarationServ(db, &input, "outdeclaration")
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "申请表提交失败", "errormessage": err.Error()})
				return
			}

		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误", "errormessage": "DeclarationCon参数错误"})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"message": "申请表提交成功"})

	}
}

// 获取申请表数据
func GetDeclarationInfoCon(service *storserv.StorageService) gin.HandlerFunc {
	return func(c *gin.Context) {
		action := c.Param("action")
		idstr := c.Param("search_id")
		fmt.Println("Action:", action)
		fmt.Println("ID:", idstr)

		// 将字符串转换为整数
		id, err := strconv.Atoi(idstr)
		if err != nil {
			c.JSON(400, gin.H{"error": "无效的 ID"})
			return
		}

		if action == "cg" {
			cgInfo, err := service.GetAllProcurementInfoServ(c, id)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "获取采购申请信息失败", "errormessage": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": "信息获取成功", "data": cgInfo})
		} else if action == "ck" {
			fmt.Println("id", id)
			ckInfo, err := service.GetAllOutDeclarationInfoServ(c, id)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "获取采购申请信息失败", "errormessage": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": "信息获取成功", "data": ckInfo})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误", "errormessage": " GetDeclarationInfoCon参数错误"})
		}

	}
}

// 获取入库出库审核记录状态
func GetOperationStatusCon(service *storserv.StorageService) gin.HandlerFunc {
	return func(c *gin.Context) {
		action := c.Param("action")
		combinedParam := c.Param("search_id")                       // 这里获取的是合并后的参数
		searchIDStr := strings.TrimPrefix(combinedParam, "status_") // 去掉前缀 "status_"
		recordid, err := strconv.Atoi(searchIDStr)                  // 将字符串转换为整数

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "无效的搜索ID", "errormessage": err.Error()})
			return
		}

		var operationStatus map[string]string
		operationStatus, err = service.GetOperationStatusServ(c, recordid, action)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "获取采购申请信息失败", "errormessage": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "信息获取成功", "data": operationStatus})
	}
}
