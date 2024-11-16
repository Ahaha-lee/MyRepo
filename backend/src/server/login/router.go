package server

import (
	"database/sql"
	loginCon "mygo/login/controllers"
	loginRepo "mygo/login/repositories"
	loginServ "mygo/login/services"

	"github.com/gin-gonic/gin"
)

func LoginRoutes(server *gin.Engine, db *sql.DB) {
	// 创建 LoginRepository 实例
	repo := loginRepo.NewLoginRepository(db)
	// 创建 LoginService 实例
	service := loginServ.NewLoginService(repo)

	userGroup := server.Group("/api/users")
	{
		userGroup.POST("/login", loginCon.GetUsers(service))
		userGroup.POST("/register", loginCon.CreateUser(service))
	}
}
