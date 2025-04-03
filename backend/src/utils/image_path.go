package utils

// import (
// 	"fmt"
// 	"io"
// 	"os"
// 	"path/filepath"
// 	"strconv"
// 	"time"

// 	"github.com/gin-gonic/gin"
// )

// // 通用的获取并验证ID函数
// func getAndValidateID(c *gin.Context, idParamName string) (int, bool) {
// 	idStr := c.PostForm(idParamName)
// 	if idStr == "" {
// 		idStr = c.Query(idParamName)
// 	}
// 	productID, err := strconv.Atoi(idStr)
// 	if err != nil {
// 		c.JSON(400, gin.H{"error": fmt.Sprintf("Invalid %s format", idParamName)})
// 		return 0, false
// 	}
// 	return productID, true
// }

// // 通用的文件上传处理函数
// func handleFileUpload(c *gin.Context, fileParamName string) (string, bool) {
// 	file, header, err := c.Request.FormFile(fileParamName)
// 	if err != nil {
// 		c.JSON(400, gin.H{"error": fmt.Sprintf("Failed to get %s", fileParamName)})
// 		return "", false
// 	}
// 	defer file.Close()

// 	// 生成唯一文件名
// 	now := time.Now().UnixNano()
// 	ext := filepath.Ext(header.Filename)
// 	newFileName := fmt.Sprintf("%d%s", now, ext)

// 	// 创建存储目录（如果不存在）
// 	dir := "uploads"
// 	if _, err := os.Stat(dir); os.IsNotExist(err) {
// 		os.MkdirAll(dir, 0755)
// 	}

// 	// 保存文件到本地
// 	out, err := os.Create(filepath.Join(dir, newFileName))
// 	if err != nil {
// 		c.JSON(500, gin.H{"error": fmt.Sprintf("Failed to create file for %s", fileParamName)})
// 		return "", false
// 	}
// 	defer out.Close()

// 	_, err = io.Copy(out, file)
// 	if err != nil {
// 		c.JSON(500, gin.H{"error": fmt.Sprintf("Failed to save file for %s", fileParamName)})
// 		return "", false
// 	}

// 	return filepath.Join(dir, newFileName), true
// }

// // 处理图片上传
// func uploadImage(c *gin.Context) {
// 	imagePath, ok := handleFileUpload(c, "image")
// 	if !ok {
// 		return
// 	}

// 	productID, ok := getAndValidateID(c, "product_id")
// 	if !ok {
// 		return
// 	}

// 	// 存储图片路径到数据库
// 	result := db.Model(&Product{}).Where("product_id =?", productID).Update("image_path", imagePath)
// 	if result.Error != nil {
// 		c.JSON(500, gin.H{"error": "Failed to save image path to database"})
// 		return
// 	}

// 	c.JSON(200, gin.H{"message": "Image uploaded successfully", "image_path": imagePath})
// }

// // 获取产品图片路径
// func getProductImagePath(c *gin.Context) {
// 	productID, ok := getAndValidateID(c, "product_id")
// 	if !ok {
// 		return
// 	}

// 	var product Product
// 	result := db.First(&product, "product_id =?", productID)
// 	if result.Error != nil {
// 		c.JSON(500, gin.H{"error": "Failed to get product from database"})
// 		return
// 	}

// 	c.JSON(200, gin.H{"image_path": product.ImagePath})
// }
