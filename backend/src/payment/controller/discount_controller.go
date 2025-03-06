package payment

import (
	paymodels "mygo/payment/models"
	payserv "mygo/payment/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CRUDForDiscountRules(service *payserv.PaymentService) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "GET" {
			searchidint, _ := strconv.Atoi(c.Param("search_id"))
			page, _ := strconv.Atoi(c.Param("page"))
			discounts, totalnum, err := service.GetDiscountinfoServ(c.Request.Context(), searchidint, page)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			var discountValues []paymodels.DiscountStruct
			for _, d := range discounts {
				discountValues = append(discountValues, *d) // 解引用指针
			}
			c.JSON(http.StatusOK, gin.H{"message": "数据获取成功", "discounts": discountValues, "totalnum": totalnum})
		} else if c.Request.Method == "POST" {
			action := c.Param("action")
			if action == "insert" {
				var discount paymodels.DiscountStruct
				if err := c.ShouldBindJSON(&discount); err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
					return
				}
				err := service.InsertDiscountInfoServ(c.Request.Context(), &discount)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"message": "数据插入失败", "error": err.Error()})
				}
				c.JSON(http.StatusCreated, gin.H{"message": "数据插入成功", "discount": discount})
			} else if action == "delete" {
				var ids []int
				if err := c.ShouldBindJSON(&ids); err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误", "errormessage": err.Error()})
					return
				}
				err := service.DeleteDiscountInfoServ(c.Request.Context(), ids)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "删除失败", "errormessage": err.Error()})
					return
				}
				c.JSON(http.StatusOK, gin.H{"message": "删除成功", "ids": ids})
			}
		}

	}
}

func CRUDForDiscountTypeRules(service *payserv.PaymentService) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "GET" {
			searchidint, _ := strconv.Atoi(c.Param("search_id"))
			page, _ := strconv.Atoi(c.Param("page"))
			discountTypes, total_num, err := service.GetDiscountTypeInfoServ(c.Request.Context(), searchidint, page)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			var discount_types []paymodels.DiscountTypeStruct
			for _, d := range discountTypes {
				discount_types = append(discount_types, *d) // 解引用指针
			}
			c.JSON(http.StatusOK, gin.H{"message": "数据获取成功", "discountTypes": discount_types, "total_num": total_num})
		} else if c.Request.Method == "POST" {
			action := c.Param("action")
			if action == "insert" {
				var discountTypes []paymodels.DiscountTypeStruct
				if err := c.ShouldBindJSON(&discountTypes); err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
					return
				}
				// 将 discountTypes 转换为 []*paymodels.DiscountTypeStruct
				discountTypePtrs := make([]*paymodels.DiscountTypeStruct, len(discountTypes))
				for i, dt := range discountTypes {
					discountTypePtrs[i] = &dt
				}

				err := service.InsertDiscountTypeInfoServ(c.Request.Context(), discountTypePtrs)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "插入失败", "errormessage": err.Error()})
					return
				}
				c.JSON(http.StatusCreated, gin.H{"message": "插入成功", "discountTypes": discountTypes})
			}
		}
	}
}
