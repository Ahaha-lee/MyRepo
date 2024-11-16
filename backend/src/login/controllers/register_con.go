package login

import (
	"context"
	"fmt"
	loginModels "mygo/login/models"
	loginServ "mygo/login/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateUser(service *loginServ.LoginService) gin.HandlerFunc {
	return func(c *gin.Context) {
		input := loginModels.Registerinput{}

		if err := c.ShouldBindJSON(&input); err != nil {
			// 如果绑定失败，返回 400 错误和错误信息
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		fmt.Println("input", input)

		// 创建新用户
		ctx := context.Background()
		err := service.RegisterServ(ctx, &input)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "注册失败", "errormessage": err.Error()})
			return
		}

		// 注册成功
		c.JSON(http.StatusCreated, gin.H{"message": "用户注册成功", "user": input})
	}
}
