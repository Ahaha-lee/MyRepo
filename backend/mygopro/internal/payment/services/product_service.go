package payment

import (
	"context"
	"fmt"
	paymentmodels "mygopro/internal/payment/models"
	payrepo "mygopro/internal/payment/repositories"
	sharedutils "mygopro/utils"
)

type PaymentService struct {
	paymentrepo *payrepo.PaymentRepository
}

func NewPaymentService(paymentrepo *payrepo.PaymentRepository) *PaymentService {
	return &PaymentService{
		paymentrepo: paymentrepo,
	}
}

func ProductinfoinsertServ[T any](ctx context.Context, tableName string, productdataStruct *T) error {

	err := payrepo.ProductdatainsertRepo(tableName, productdataStruct)
	fmt.Println("productserv", productdataStruct)
	if err != nil {
		return err
	}
	return nil
}

func (s *PaymentService) PaymentDeleteServ(ctx context.Context, ID string, keyword string, tableName string) error {

	_, err := payrepo.ProductDelete(ctx, ID, tableName, keyword)
	if err != nil {
		return fmt.Errorf("删除表信息失败: %w", err)
	}
	return nil
}

func (s *PaymentService) PaymentUpdateServ(ctx context.Context, tableName string, id string, updates map[string]interface{}, keyword string) error {
	err := sharedutils.UpdateTableinfo(tableName, id, updates, keyword)
	if err != nil {
		return fmt.Errorf("更新信息时出错: %w", err)
	}
	return nil
}

func GetTableCountServ(tableName string) (int, error) {
	db := sharedutils.DataBaseConnect()
	if db == nil {
		return 0, fmt.Errorf("数据库连接失败")
	}
	defer db.Close()
	count, err := sharedutils.GetTableCount(db, tableName)
	if err != nil {
		fmt.Println(err)
		return 0, err
	}
	return count, nil
}

func (s *PaymentService) ProcessPurchases(purchases []paymentmodels.PurchaseTableStruct) error {
	return s.paymentrepo.SavePurchases(purchases)
}
func (s *PaymentService) ProcessApplicableItems(purchases []paymentmodels.ApplicableItemsStruct) error {
	return s.paymentrepo.SaveDApplicableItems(purchases)
}

func (s *PaymentService) DiscountItemsInfoServ(ctx context.Context, barcode string) ([]float64, error) {
	// 获取商品信息
	productInfoInterface, err := sharedutils.GetTableInfo(ctx, barcode, "productsdata")
	if err != nil {
		fmt.Println("获取商品信息失败:", err)
	}
	// 打印返回值的类型和内容
	fmt.Printf("返回值类型: %T, 内容: %+v\n", productInfoInterface, productInfoInterface)
	// 类型断言
	productInfo, ok := productInfoInterface.(*paymentmodels.AllProductinfoStruct)
	if !ok {
		fmt.Println("商品信息类型断言失败")
	}

	fmt.Println("1", productInfo)

	// 获取折扣信息
	discountRules, err := payrepo.DiscountItemsInfo(ctx, barcode)
	if err != nil {
		fmt.Println("获取折扣信息失败:", err)
	}
	fmt.Println("2", discountRules)

	// 获取商品的零售价格
	var data []float64
	var discountedPrice float64
	var minPrice float64

	// 遍历折扣规则并应用折扣
	for _, rule := range discountRules {
		if rule.RuleType == "商品折扣" {
			// 计算折扣后的价格
			discountedPrice = productInfo.ProductInsertStruct.RetailPrice * rule.DiscountRate
			data = append(data, discountedPrice)
		} else if rule.RuleType == "总价折扣" {
			discountedPrice = rule.DiscountRate
			data = append(data, discountedPrice)
			minPrice = rule.MinPrice
			data = append(data, minPrice)
		}
	}

	fmt.Println("discountedPrice", data)
	return data, nil
}
