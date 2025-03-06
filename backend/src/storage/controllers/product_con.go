package storage

import (
	"fmt"
	stormodels "mygo/storage/models"
	storser "mygo/storage/service"
	"net/http"
	"regexp"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Productids struct {
	Data []int `json:"data"`
}

func CRUDForProductsCon(server *storser.StorageGormService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 插入数据
		if c.Request.Method == "POST" {
			action := c.Param("action")
			if action == "insert" {
				input := []*stormodels.ProductStruct{}           // 修改为指针切片
				if err := c.ShouldBindJSON(&input); err != nil { // 传递指针
					c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误", "errormessage": err.Error()})
					return
				}

				if err := server.InsertProductInfoServ(c, input); err != nil { // 传递指针切片
					c.JSON(http.StatusInternalServerError, gin.H{"error": "插入数据失败", "errormessage": err.Error()})
					return
				}

				c.JSON(http.StatusCreated, gin.H{"message": "插入数据成功"})
			} else if action == "batchdelete" {
				ids := Productids{}

				if err := c.BindJSON(&ids); err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误2", "errormessage": err.Error()})
					return
				}
				fmt.Println("ids.Data:", ids.Data)
				err := server.DeleteProductServ(c, 0, ids.Data)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "数据删除错误", "errormessage": err.Error()})
					return
				}
			}
		} else if c.Request.Method == "GET" {
			// 获取数据
			id, err := strconv.Atoi(c.Param("search_id"))
			page, _ := strconv.Atoi(c.Param("page"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误", "errormessage": err.Error()})
				return
			}

			result, total_num, err := server.SearchProductServ(c, id, page)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "查询数据失败", "errormessage": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "查询数据成功", "data": result, "total_num": total_num})

			// 删除数据
		} else if c.Request.Method == "DELETE" {
			id, err := strconv.Atoi(c.Param("delete_id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误", "errormessage": err.Error()})
				return
			}

			if id > 0 {
				var intSlice1 []int = make([]int, 0)
				err = server.DeleteProductServ(c, id, intSlice1)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "数据删除错误", "errormessage": err.Error()})
					return
				}

				c.JSON(http.StatusOK, gin.H{"message": "数据删除成功"})
			}

			// 修改数据
		} else if c.Request.Method == "PUT" {
			id, err := strconv.Atoi(c.Param("update_id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误", "errormessage": err.Error()})
				return
			}

			input := stormodels.ProductStruct{}
			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误", "errormessage": err.Error()})
				return
			}

			if err := server.UpdateProductServ(c, id, &input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "数据更新失败", "errormessage": err.Error()})
				return
			}

			c.JSON(http.StatusOK, gin.H{"message": "数据更新成功"})

		}

	}
}

//category

func CRUDForCatgoryCon(server *storser.StorageGormService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 获取数据
		if c.Request.Method == "GET" {
			searchID := c.Param("search_id")
			isNumeric := regexp.MustCompile(`^\d+$`).MatchString(searchID)
			page, _ := strconv.Atoi(c.Param("page"))
			if isNumeric {
				// searchID 是字符型的数字
				categoryid, _ := strconv.Atoi(searchID)
				category, total_num, err := server.SearchCatrgoryServ(c, categoryid, "", page)
				if err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": "查询失败", "errormessage": err})
				}
				c.JSON(http.StatusOK, gin.H{"message": "分类信息查询成功", "category": category, "total_num": total_num})

			} else {
				category, total_num, err := server.SearchCatrgoryServ(c, -1, searchID, page)
				if err != nil {
					c.JSON(http.StatusBadRequest, gin.H{"error": "查询失败", "errormessage": err})
				}
				c.JSON(http.StatusOK, gin.H{"message": "分类信息查询成功", "category": category, "total_num": total_num})
			}

			// 插入数据
		} else if c.Request.Method == "POST" {
			input := stormodels.CategoryStruct{}
			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误", "errormessage": err})
				return
			}
			err := server.InsertCategoryServ(c, &input)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "数据更新失败", "errormessage": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": "数据更新成功"})

			// 修改数据
		} else if c.Request.Method == "PUT" {
			id, err := strconv.Atoi(c.Param("update_id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误", "errormessage": err.Error()})
				return
			}

			input := stormodels.CategoryStruct{}
			if err := c.ShouldBindJSON(&input); err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误", "errormessage": err.Error()})
				return
			}
			err = server.UpdateCategroyServ(c, id, &input)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "数据更新错误", "errormessage": err.Error()})
				return
			}
			c.JSON(http.StatusOK, gin.H{"message": "数据更新成功"})

			// 删除数据
		} else if c.Request.Method == "DELETE" {
			id, err := strconv.Atoi(c.Param("id"))
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误", "errormessage": err.Error()})
				return
			}

			err = server.DeleteCategoryServ(c, id)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "数据删除失败", "errormessage": err.Error()})
			}
			c.JSON(http.StatusOK, gin.H{"message": "数据删除成功"})
		}
	}

}

func PreloadProductsByBarcodesCon(server *storser.StorageGormService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var id []int
		if err := c.ShouldBindJSON(&id); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "参数错误", "errormessage": err.Error()})
			return
		}
		err := server.PreloadProductsServ(c, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "预加载失败", "errormessage": err.Error()})
		}
		c.JSON(http.StatusOK, gin.H{"message": "预加载成功"})
	}
}

func GetAllProductsCacheCon(server *storser.StorageGormService) gin.HandlerFunc {
	return func(c *gin.Context) {
		products, err := server.GetProductCacheServ(c)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "获取缓存失败", "errormessage": err.Error()})
			return
		}
		c.JSON(http.StatusOK, products)
	}
}
func ProductCacheCon(server *storser.StorageGormService) gin.HandlerFunc {
	return func(c *gin.Context) {
		barcode := c.Param("search__id")

		product, err := server.GetProductSev(barcode)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "数据获取失败", "errormessage": err.Error()})
			return
		}
		if product != nil {
			c.JSON(http.StatusOK, gin.H{"message": "数据获取成功", "product": product})
		}
	}
}
