package storage

import (
	"log"
	stormodels "mygo/storage/models"
	storserv "mygo/storage/service"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func CRUDForInventoryCon(server *storserv.StorageGormService) gin.HandlerFunc {

	return func(c *gin.Context) {
		if c.Request.Method == "PUT" {
			id, _ := strconv.Atoi(c.Param("update_id"))
			input := stormodels.InventoryStruct{}
			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "数据绑定失败", "errormessage": err})
				return
			}
			err := server.UpdateInventoryServ(c, id, &input)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "数据更新失败", "errormessage": err})
			}
			c.JSON(http.StatusOK, gin.H{"message": "数据更新成功"})
		} else if c.Request.Method == "Delete" {
			id, _ := strconv.Atoi(c.Param("delete_id"))
			err := server.DeleteInventoryServ(c, id)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "数据删除失败", "errormessage": err})
			}
			c.JSON(http.StatusOK, gin.H{"message": "数据删除成功"})

		} else if c.Request.Method == "GET" {
			id, _ := strconv.Atoi(c.Param("search_id"))
			page, _ := strconv.Atoi(c.Param("page"))
			result, total, err := server.SearchInventoryServ(c, id, page)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "查询数据失败", "errormessage": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": "查询数据成功", "data": result, "total_num": total})
		}
	}
}

func CRUDForInventoryQuantitiesCon(server *storserv.StorageGormService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 提取路径参数
		idStr := c.Param("update_id")
		// 去除前后空格
		trimmedIdStr := strings.TrimSpace(idStr)
		log.Println("idStr:", trimmedIdStr)
		var quantities stormodels.QuantitiesStruct
		if err := c.ShouldBindJSON(&quantities); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "无效的JSON格式"})
			return
		}
		log.Println("更新库存数量", quantities)
		if err := server.UpdateInventoryQuantitiesServ(c, trimmedIdStr, &quantities); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "更新库存失败"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "库存更新成功"})
	}
}
