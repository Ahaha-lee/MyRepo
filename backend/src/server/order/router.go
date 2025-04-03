package server

import (
	ordercon "mygo/order/controller"
	orderrepo "mygo/order/repositories"
	orderserv "mygo/order/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func OrderRoutes(server *gin.Engine, db *gorm.DB) {
	orderrepo := orderrepo.NewOrderRepository(db)
	orderService := orderserv.NewOrderService(orderrepo)
	orderGroup := server.Group("/api/order")
	{
		orderGroup.GET("/:search_id/:page", ordercon.CRUDForOrderIndex(orderService))
		orderGroup.GET("/products/:search_id", ordercon.CRUDOrderContent(orderService))
		orderGroup.POST("/insert", ordercon.CRUDForOrderIndex(orderService))

	}

}
