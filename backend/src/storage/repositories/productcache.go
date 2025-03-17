package storage

import (
	"fmt"
	"log"
	stormodels "mygo/storage/models"
	"sync"
	"time"

	"gorm.io/gorm"
)

var (
	productCache sync.Map
	config       stormodels.CacheConfig
	db           *gorm.DB
)

// GetProduct 获取商品信息并更新访问计数
func GetProduct(id string) ([]stormodels.ProductStruct, error) {
	// 先从缓存中查询
	log.Println("GetProduct: Checking cache for ID:", id)
	if cached, ok := productCache.Load(id); ok {
		cacheData := cached.(stormodels.ProductCache)
		// 更新访问信息
		cacheData.AccessCount++
		cacheData.LastAccess = time.Now()
		productCache.Store(id, cacheData)

		// 异步更新访问统计
		go updateProductStats(id)

		log.Println("GetProduct: Found in cache:", cacheData.Product)

		// 将产品包装到数组中
		return []stormodels.ProductStruct{cacheData.Product}, nil
	}

	// 缓存中没有，从数据库查询
	var product stormodels.ProductStruct
	var stats stormodels.ProductStats

	err := db.Transaction(func(tx *gorm.DB) error {
		// 使用模糊查询
		log.Println("GetProduct: Searching in database:")
		if err := tx.Where("pro_barcode LIKE ?", "%"+id+"%").First(&product).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				log.Printf("Product not found in database for ID: %s", id)
				return err
			}
			log.Printf("Failed to get product info: %v", err)
			return err
		}

		// 获取统计信息
		if err := tx.Where("product_barcode = ?", id).First(&stats).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				log.Printf("Product stats not found in database for ID: %s", id)
				return nil // 统计信息不存在不应阻止返回产品信息
			}
			log.Printf("Failed to get product stats: %v", err)
			return err
		}

		return nil
	})

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fmt.Errorf("product not found for ID: %s", id)
		}
		log.Println("GetProduct error:", err)
		return nil, err
	}

	// 更新访问统计（同步执行）
	updateProductStats(id)

	// 检查是否需要加入缓存
	if shouldAddToCache(stats.VisitCount, 10) {
		log.Printf("Adding product to cache: %+v", product)
		productCache.Store(id, stormodels.ProductCache{
			Product:     product,
			AccessCount: 1,
			LastAccess:  time.Now(),
		})
	} else {
		log.Println("Not adding to cache due to visit count:", stats.VisitCount)
	}

	return []stormodels.ProductStruct{product}, nil
}

// updateProductStats 更新商品访问统计
func updateProductStats(id string) {
	// 添加错误处理
	result := db.Exec(`
        INSERT INTO product_stats (product_barcode, visit_count, last_visit_time, daily_visits, weekly_visits, monthly_visits)
        VALUES (?, 1, NOW(), 1, 1, 1)
        ON DUPLICATE KEY UPDATE
            visit_count = visit_count + 1,
            last_visit_time = NOW(),
            daily_visits = CASE 
                WHEN DATE(last_visit_time) = DATE(NOW()) THEN daily_visits + 1 
                ELSE 1 
            END,
            weekly_visits = CASE 
                WHEN YEARWEEK(last_visit_time) = YEARWEEK(NOW()) THEN weekly_visits + 1 
                ELSE 1 
            END,
            monthly_visits = CASE 
                WHEN DATE_FORMAT(last_visit_time, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m') THEN monthly_visits + 1 
                ELSE 1 
            END
    `, id)

	if result.Error != nil {
		// 考虑添加日志记录
		log.Printf("Error updating product stats for ID %s: %v", id, result.Error)
	}
}

// CleanCache 清理缓存中访问频率低的商品
func CleanCache() {
	now := time.Now()
	var idsToRemove []int

	productCache.Range(func(key, value interface{}) bool {
		cacheData := value.(stormodels.ProductCache)

		// 清理规则：
		// 1. 访问次数低于阈值
		// 2. 最后访问时间超过过期时间
		if cacheData.AccessCount < config.MinAccessCount ||
			now.Sub(cacheData.LastAccess) > config.ExpirationTime {
			idsToRemove = append(idsToRemove, key.(int))
		}
		return true
	})

	// 删除需要清理的缓存项
	for _, id := range idsToRemove {
		productCache.Delete(id)
	}
}

// shouldAddToCache 判断是否应该加入缓存
func shouldAddToCache(visitCount int, mincount int) bool {
	return visitCount >= mincount
}

// InitCache 初始化缓存系统
func InitCache(dbConn *gorm.DB, cfg stormodels.CacheConfig) error {
	// 1. 保存数据库连接和配置
	db = dbConn
	config = cfg

	// 3. 启动定期清理协程
	go startCleanupWorker()

	// 4. 启动缓存监控协程
	go startCacheMonitor()

	return nil
}

func GetAllProductsCache() ([]stormodels.ProductCache, error) {
	var allData []stormodels.ProductCache

	productCache.Range(func(_, value interface{}) bool {
		cacheItem, ok := value.(stormodels.ProductCache)
		if !ok {
			log.Println("类型断言失败，无法转换为 ProductCache")
			return true // 继续迭代
		}
		allData = append(allData, cacheItem)
		return true
	})

	log.Println("GetAllProductsCache:", allData)
	return allData, nil
}

// preloadHotProducts 预加载热门商品
func PreloadProductsByID(id []int) error {
	var products []stormodels.ProductStruct
	var stats []stormodels.ProductStats
	var barcodes []string

	// 1. 获取商品详细信息
	result := db.Where("product_id IN ?", id).Find(&products)
	if result.Error != nil {
		return fmt.Errorf("获取商品详情失败: %v", result.Error)
	}

	// 2. 提取所有的 barcode
	for _, product := range products {
		barcodes = append(barcodes, product.ProBarcode)
	}

	// 3. 获取商品统计数据
	result = db.Table("product_stats").
		Where("product_barcode IN ?", barcodes).
		Find(&stats)
	if result.Error != nil {
		return fmt.Errorf("获取商品统计失败: %v", result.Error)
	}

	// 4. 检查是否有统计数据，如果没有则插入新的数据
	if len(stats) == 0 {
		for _, barcode := range barcodes {
			newStat := stormodels.ProductStats{
				ProductBarcode: barcode,
				VisitCount:     0,
				DailyVisits:    0,
				WeeklyVisits:   0,
				MonthlyVisits:  0,
			}

			// 插入新的统计数据
			if err := db.Table("product_stats").Create(&newStat).Error; err != nil {
				return fmt.Errorf("插入商品统计失败: %v", err)
			}
			log.Printf("stas数据插入错误: %s", barcode)
		}

		// 重新查询以获取刚插入的数据
		result = db.Table("product_stats").
			Where("product_barcode IN ?", barcodes).
			Find(&stats)
		if result.Error != nil {
			return fmt.Errorf("获取商品统计失败: %v", result.Error)
		}
	}

	// 4. 构建统计数据映射
	statsMap := make(map[string]stormodels.ProductStats)
	for _, stat := range stats {
		statsMap[stat.ProductBarcode] = stat
	}

	// 5. 加载到缓存
	for _, product := range products {
		if stat, ok := statsMap[product.ProBarcode]; ok {
			// 直接将产品添加到缓存
			log.Printf("Adding product to cache: %+v", product)
			// 创建新的 ProductCache
			productCache.Store(product.ProBarcode, stormodels.ProductCache{
				Product:     product,
				AccessCount: stat.VisitCount, // 使用统计数据中的访问量
				LastAccess:  time.Now(),
			})
			log.Printf("成功添加商品到缓存: %s", product.ProBarcode) // 记录成功添加的商品
		} else {
			log.Println("No stats found for product:", product.ProBarcode)
		}
	}

	return nil
}

// startCleanupWorker 启动清理工作协程
func startCleanupWorker() {
	ticker := time.NewTicker(config.CleanupInterval)
	for range ticker.C {
		CleanCache()
	}
}

// startCacheMonitor 启动缓存监控
func startCacheMonitor() {
	ticker := time.NewTicker(3 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		var itemCount int
		var barcodes []string

		productCache.Range(func(key, value interface{}) bool {
			cacheData := value.(stormodels.ProductCache)

			itemCount++
			barcodes = append(barcodes, cacheData.Product.ProBarcode)
			return true
		})

		log.Printf("缓存状态 - 商品数量: %d, 条形码: %v", itemCount, barcodes)
	}
}

// 删除缓存函数
func DeleteProductCache(id []string) error {
	var errs error
	for _, eachId := range id {
		productCache.Delete(eachId)
	}
	return errs
}

// 更新缓存函数
func UpdateProductCache(id int, product stormodels.ProductStruct) error {
	// 更新缓存中的商品
	productCache.Store(id, product)
	return nil
}
