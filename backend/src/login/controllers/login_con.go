package login

import (
	"context"
	"fmt"
	loginModels "mygo/login/models"
	loginServ "mygo/login/services"
	utils "mygo/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetUsers(service *loginServ.LoginService) gin.HandlerFunc {
	return func(c *gin.Context) {
		input := loginModels.Logininput{}
		var takenStr string

		//前端数据绑定与JSON
		if err := c.ShouldBindJSON(&input); err != nil {
			// 如果绑定失败，返回 400 错误和错误信息
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		fmt.Println("user_input", input)

		// 创建新用户
		ctx := context.Background()
		err := service.LoginServ(ctx, input.Name, input.Password)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "登录失败", "errormessage": err.Error()})
			return
		}
		// 生成token
		if input.Name != "" && input.Password != "" {
			takenStr, err = utils.GenerateToken(input.Name, input.Password)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "生成token失败", "errormessage": err.Error()})
			}
			fmt.Println("login token", takenStr)
			// takenheader := c.GetHeader("Authorization")
			// fmt.Println("takenheader", takenheader)
		}
		userinfo := map[string]interface{}{
			"name":     input.Name,
			"password": takenStr,
		}

		// 注册成功
		c.JSON(http.StatusCreated, gin.H{"message": "用户登录成功", "user": userinfo})
	}
}
