package storage

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	stormodels "mygo/storage/models"
	storserv "mygo/storage/service"

	"github.com/gin-gonic/gin"
)

func GetStructType(operation string) (interface{}, error) {
	switch operation {
	case "sh":
		return &stormodels.CaiGouCheckStruct{}, nil
	case "rk":
		return &stormodels.CaiGouPutintruct{}, nil
	case "ys":
		return &stormodels.CaiGouExamineStruct{}, nil
	default:
		return nil, errors.New("caigouoperation错误")
	}
}

func CaiGouOperationCon(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		operation := c.Param("operation")
		recordIDStr := c.Param("update_id")
		recordID, err := strconv.Atoi(recordIDStr) // 将字符串转换为整数
		if err != nil {
			c.JSON(400, gin.H{"error": "Invalid record ID"})
			return
		}

		fmt.Println(operation, recordID)
		input, err := GetStructType(operation)
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
		case *stormodels.CaiGouCheckStruct:
			serviceErr = storserv.CaigouOperatenServ(c.Request.Context(), db, recordID, v)
		case *stormodels.CaiGouPutintruct:
			serviceErr = storserv.CaigouOperatenServ(c.Request.Context(), db, recordID, v)
		case *stormodels.CaiGouExamineStruct:
			serviceErr = storserv.CaigouOperatenServ(c.Request.Context(), db, recordID, v)
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

func GetCGProgressInfoCon(server *storserv.StorageService) gin.HandlerFunc {
	return func(c *gin.Context) {
		page, _ := strconv.Atoi(c.Param("page"))
		record, err := server.GetProcurementInfoServ(c, 0, page)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "数据获取错误", "errormessage": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "信息获取成功", "data": record})

	}
}

//获取入库记录数据

func GetInboundRecordsCon(server *storserv.StorageService) gin.HandlerFunc {
	return func(c *gin.Context) {
		recordid, _ := strconv.Atoi(c.Param("search_id"))
		page, _ := strconv.Atoi(c.Param("page"))

		record, total, err := server.GetInboundRecordsServ(c, recordid, page)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "数据获取错误", "errormessage": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "信息获取成功", "data": record, "page_num": total})
	}
}

//更新申请表的信息

func CGDeclarationUpdateCon(server *storserv.StorageService) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "PUT" {
			recordid, _ := strconv.Atoi(c.Param("update_id"))
			action := c.Param("action")
			if action == "cg_declaration" {
				var newStruct stormodels.ProcurmentStruct
				if err := c.ShouldBindJSON(&newStruct); err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": "请求体", "errormessage": err.Error()})
					return
				}
				fmt.Println(recordid)
				fmt.Println(newStruct)
				err := server.CGDeclarationUpdateServ(c, recordid, &newStruct)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "数据更新错误", "errormessage": err.Error()})
					return
				}
				c.JSON(http.StatusOK, gin.H{"message": "数据更新成功"})
			} else if action == "ck" {

			}
		}
	}
}
