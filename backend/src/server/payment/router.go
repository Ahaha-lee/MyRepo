package server

import (
	paycon "mygo/payment/controller"
	payrepo "mygo/payment/repositories"
	payserv "mygo/payment/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func PaymentRoutes(server *gin.Engine, db *gorm.DB) {
	payrepo := payrepo.NewPaymentRepository(db)
	payservices := payserv.NewPaymentService(payrepo)

	paymentgroup := server.Group("/api/payment/discount")
	{
		paymentgroup.GET("/:search_id/:page", paycon.CRUDForDiscountRules(payservices))
		paymentgroup.POST("/:action", paycon.CRUDForDiscountRules(payservices))

		paymentgroup.GET("/type/:search_id/:page", paycon.CRUDForDiscountTypeRules(payservices))
		paymentgroup.POST("/type/:action", paycon.CRUDForDiscountTypeRules(payservices))
	}

}
