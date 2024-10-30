package payment

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	paymentmodels "mygopro/internal/payment/models"
	sharedutils "mygopro/utils"
	"strings"

	"github.com/jmoiron/sqlx"
)

type PaymentRepository struct {
	db *sql.DB
}

func NewPaymentRepository(db *sql.DB) *PaymentRepository {
	// 构造函数
	return &PaymentRepository{
		db: db,
	}
}

func ProductdatainsertRepo[T any](tableName string, productdataStruct *T) error {
	db := sharedutils.DataBaseConnect()
	if db == nil {
		fmt.Println("数据库连接失败")
		return fmt.Errorf("数据库连接失败")
	}
	defer db.Close() // 确保在函数结束时关闭数据库连接

	// 构建 SQL 插入语句
	fields, values, err := sharedutils.BuildlongQuery(productdataStruct, "")
	if err != nil {
		return fmt.Errorf("productdate BuildlongQuery出错: %w", err)
	}
	fmt.Println("prodata字段", fields)
	fmt.Println("prodata值", values, len(values))

	placeholders := strings.Repeat("?, ", len(fields)-1) + "?"

	query := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s)", tableName, strings.Join(fields, ", "), placeholders)

	// 执行 SQL 插入语句
	sqlresu, err := db.Exec(query, values...) // 只传递 values
	fmt.Println(query)
	if err != nil {
		return fmt.Errorf("数据库插入语句失败: %w", err)
	}

	// 打印执行结果
	fmt.Println("执行结果:", sqlresu)

	return nil
}

func ProductDelete(ctx context.Context, id string, tablename string, keywords string) (int64, error) {

	db := sharedutils.DataBaseConnect()
	if db == nil {
		fmt.Println("数据库连接失败")
		return 0, fmt.Errorf("数据库连接失败")
	}
	defer db.Close() // 确保在函数结束时关闭数据库连接

	query := fmt.Sprintf("DELETE FROM %s WHERE %s= ?", tablename, keywords)
	result, err := db.Exec(query, id)
	if err != nil {
		return 0, err
	}

	// 获取受影响的行数
	rowsAffected, err := result.RowsAffected()

	if err != nil {
		return 0, err
	}

	return rowsAffected, nil
}

func (r *PaymentRepository) SavePurchases(purchases []paymentmodels.PurchaseTableStruct) error {
	for _, purchase := range purchases {
		_, err := r.db.Exec("INSERT INTO purchasetable (PurchaseID,PurchaseproBarcode, PurchaseproName, PurchaseproRetailPrice, PurchaseproQuantities, ProductUnit) VALUES (?, ?, ?, ?, ?, ?)",
			purchase.PurchaseID,
			purchase.PurchaseproBarcode,
			purchase.PurchaseproName,
			purchase.PurchaseproRetailPrice,
			purchase.PurchaseproQuantities,
			purchase.ProductUnit,
		)
		if err != nil {
			log.Printf("Error saving purchase: %v", err)
			return err
		}
	}
	return nil
}

func (r *PaymentRepository) SaveDApplicableItems(items []paymentmodels.ApplicableItemsStruct) error {
	for _, item := range items {
		_, err := r.db.Exec("INSERT INTO applicableitems (DiscountRuleID,ProductBarcode) VALUES (?, ?)",
			item.DiscountRuleID,
			item.ProductBarcode,
		)
		if err != nil {
			log.Printf("Error saving applicable: %v", err)
			return err
		}
	}
	return nil
}

func DiscountItemsInfo(ctx context.Context, barcode string) ([]paymentmodels.DiscountStruct, error) {
	// 创建一个新的 sqlx.DB 实例
	dsn := "root:123456@tcp(127.0.0.1:3306)/dingguaguadb"
	db, err := sqlx.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("无法连接到数据库: %v", err)
		return nil, err
	}
	defer db.Close()

	// 查询 DiscountRuleID
	query := `SELECT DiscountRuleID FROM applicableitems WHERE ProductBarcode = ?`
	var discountRuleID string
	err = db.QueryRowContext(ctx, query, barcode).Scan(&discountRuleID)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("未找到对应的 DiscountRuleID，Barcode: %s", barcode)
			return nil, nil
		}
		log.Printf("获取 DiscountRuleID 失败，Barcode: %s, 错误: %v", barcode, err)
		return nil, fmt.Errorf("无法获取 DiscountRuleID: %w", err)
	}
	fmt.Println("DiscountRuleID", discountRuleID)

	// 查询优惠规则
	query1 := `
        SELECT DISTINCT d.DiscountRuleID,d.RuleType,d.MinPrice,d.DiscountRate,d.DiscountAmount,d.IsVIP
		FROM discount_rules d
		JOIN applicableitems a ON d.DiscountRuleID = a.DiscountRuleID
		WHERE d.DiscountRuleID = ?
		LIMIT 1;`

	var discountRules []paymentmodels.DiscountStruct

	if err := db.SelectContext(ctx, &discountRules, query1, discountRuleID); err != nil {
		log.Printf("获取优惠商品信息失败，DiscountRuleID: %s, 错误: %v", discountRuleID, err)
		return nil, fmt.Errorf("无法获取优惠商品信息: %w", err)
	}

	return discountRules, nil
}
