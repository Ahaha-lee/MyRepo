package order

import (
	"log"
	ordermodel "mygo/order/model"
	orderserv "mygo/order/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type OrderRequest struct {
	OrderIndex    ordermodel.OrderIndexStruct     `json:"order_index"`
	OrderProducts []ordermodel.OrderProductStruct `json:"order_products"`
}

func CRUDForOrderIndex(service *orderserv.OrderService) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "GET" {
			id, _ := strconv.Atoi(c.Param("search_id"))
			page, _ := strconv.Atoi(c.Param("page"))
			ordersindex, count, err := service.GetOrderIndexesServ(c, id, page)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{
				"index": ordersindex,
				"count": count,
			})
		} else if c.Request.Method == "POST" {
			var orderRequest OrderRequest

			// 绑定订单请求数据
			if err := c.ShouldBindJSON(&orderRequest); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				return
			}

			log.Println("orderRequest:", orderRequest)
			// 调用服务层插入订单数据
			err := service.InsertOrderServ(c, &orderRequest.OrderIndex, orderRequest.OrderProducts)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "Order inserted successfully"})
		}
	}
}

func CRUDOrderContent(service *orderserv.OrderService) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.Method == "GET" {
			id, _ := strconv.Atoi(c.Param("search_id"))
			ordersproducts, err := service.GetOrderProductsServ(c, int(id))
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": ordersproducts})
		}
	}
}
