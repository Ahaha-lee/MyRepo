package storage

import (
	"database/sql"
	"errors"
	stormodels "mygo/storage/models"
	storserv "mygo/storage/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetckStructType(operation string) (interface{}, error) {
	switch operation {
	case "sh":
		return &stormodels.OutCheckStruct{}, nil
	case "ck":
		return &stormodels.OutStorageStruct{}, nil
	default:
		return nil, errors.New("chukuoperation错误")
	}
}

func ChuKuOperationCon(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		operation := c.Param("operation")
		recordIDStr := c.Param("update_id")
		recordID, err := strconv.Atoi(recordIDStr) // 将字符串转换为整数
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid record ID"})
			return
		}

		input, err := GetckStructType(operation)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "结构体错误", "errormessage": err.Error()})
			return
		}

		if err := c.ShouldBindJSON(input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "请求体", "errormessage": err.Error()})
			return
		}

		var serviceErr error
		switch v := input.(type) {
		case *stormodels.OutCheckStruct:
			serviceErr = storserv.ChuKuOperatenServ(c.Request.Context(), db, recordID, v)
		case *stormodels.OutStorageStruct:
			serviceErr = storserv.ChuKuOperatenServ(c.Request.Context(), db, recordID, v)
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "未知的输入类型"})
			return
		}

		if serviceErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "数据提交错误", "errormessage": serviceErr.Error()})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"message": "数据提交成功"})
	}
}

func GetCKProgressInfoCon(server *storserv.StorageService) gin.HandlerFunc {
	return func(c *gin.Context) {
		page, _ := strconv.Atoi(c.Param("page"))
		record, err := server.GetOutDeclarationInfoServ(c, 0, page)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "数据获取错误", "errormessage": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "信息获取成功", "data": record})
	}
}

func GetOutboundRecordsCon(server *storserv.StorageService) gin.HandlerFunc {
	return func(c *gin.Context) {
		recordid, _ := strconv.Atoi(c.Param("search_id"))
		page, _ := strconv.Atoi(c.Param("page"))

		record, err := server.GetOutboundRecordsServ(c, recordid, page)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "数据获取错误", "errormessage": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "信息获取成功", "data": record})
	}
}
