package sysmanage

import (
	"log"
	sysserv "mygo/sysmanage/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func CRUDForPermissionCon(services *sysserv.SystemMamageService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("search_id"))
		permission, total_num, err := services.GetPermissionInfoServ(c, id)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"permission": permission, "total_num": total_num})
	}
}

func CRUDForRoleCon(services *sysserv.SystemMamageService) gin.HandlerFunc {
	return func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("search_id"))
		role, err := services.GetRoleInfoServ(c, id)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"role": role})

	}

}

func CRUDForPermissionAndRoleCon(services *sysserv.SystemMamageService) gin.HandlerFunc {
	return func(c *gin.Context) {
		perandrole, err := services.GetPermissionAndRoleInfoServ(c)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"permissionandrole": perandrole})

	}
}
