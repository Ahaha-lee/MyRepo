package order

import (
	"context"
	"log"
	ordermodel "mygo/order/model"

	"gorm.io/gorm"
)

type OrderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) *OrderRepository {
	return &OrderRepository{
		db: db,
	}
}

// 插入订单数据
func (r *OrderRepository) InsertOrder(ctx context.Context, orderIndex *ordermodel.OrderIndexStruct, orderProducts []ordermodel.OrderProductStruct) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		// 插入订单索引
		if err := tx.Create(orderIndex).Error; err != nil {
			return err
		}

		log.Println("orderIndex.SaleOrderid:", orderIndex.SaleOrderid)
		// 插入订单产品
		for i := range orderProducts {
			orderProducts[i].SaleOrderid = orderIndex.SaleOrderid
			if err := tx.Create(&orderProducts[i]).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

// 获取订单索引数据
func (r *OrderRepository) GetOrderIndexes(ctx context.Context, id int, page int) ([]ordermodel.OrderIndexStruct, int, error) {
	const pageSize = 10
	var orderIndexes []ordermodel.OrderIndexStruct
	var totalNum int64

	if id == 0 {
		// 获取所有订单的总数
		if err := r.db.Model(&ordermodel.OrderIndexStruct{}).Count(&totalNum).Error; err != nil {
			return nil, 0, err
		}

		// 获取所有订单
		if err := r.db.Limit(pageSize).Offset((1 - 1) * pageSize).Find(&orderIndexes).Error; err != nil {
			return nil, 0, err
		}
	} else {
		// 获取特定订单的总数
		if err := r.db.Model(&ordermodel.OrderIndexStruct{}).Where("sale_orderid = ?", id).Count(&totalNum).Error; err != nil {
			return nil, 0, err
		}

		// 获取特定订单
		if err := r.db.Where("sale_orderid = ?", id).Limit(pageSize).Offset((page - 1) * pageSize).Find(&orderIndexes).Error; err != nil {
			return nil, 0, err
		}
	}

	return orderIndexes, int(totalNum), nil
}

// 获取订单产品数据
func (r *OrderRepository) GetOrderProducts(ctx context.Context, orderIds int) ([]ordermodel.OrderProductStruct, error) {
	var orderProducts []ordermodel.OrderProductStruct

	// 获取订单的产品
	if err := r.db.Where("sale_orderid = ?", orderIds).Find(&orderProducts).Error; err != nil {
		return nil, err
	}

	return orderProducts, nil
}
