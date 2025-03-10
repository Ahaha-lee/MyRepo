package server

import (
	syscon "mygo/sysmanage/controllers"
	sysrepo "mygo/sysmanage/repositories"
	sysserv "mygo/sysmanage/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Systemrouteres(server *gin.Engine, db *gorm.DB) {
	repo := sysrepo.NewSystemMamageRepo(db)
	services := sysserv.NewSystemMamageService(repo)

	systemgruop := server.Group("/api/system")
	{
		systemgruop.GET("/permission/getinfo/:search_id", syscon.CRUDForPermissionCon(services))

		systemgruop.GET("/role/getinfo/:search_id", syscon.CRUDForRoleCon(services))

		systemgruop.GET("/permissionroleinfo", syscon.CRUDForPermissionAndRoleCon(services))
	}

}
