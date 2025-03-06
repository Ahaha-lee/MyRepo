package payment

import (
	"context"
	"log"
	paymentmodels "mygo/payment/models"

	"gorm.io/gorm"
)

type PaymentRepository struct {
	db *gorm.DB
}

func NewPaymentRepository(db *gorm.DB) *PaymentRepository {
	return &PaymentRepository{
		db: db,
	}
}

// 优惠表
func (r *PaymentRepository) GetDiscountinfoRepo(ctx context.Context, searchid int, page int) ([]*paymentmodels.DiscountStruct, int, error) {
	const pageSize = 10 // 每页的大小
	var discounts []*paymentmodels.DiscountStruct
	var err error

	// 计算偏移量
	offset := (page - 1) * pageSize

	// 执行查询
	if searchid == 0 {
		// 查询所有记录
		err = r.db.WithContext(ctx).
			Model(&paymentmodels.DiscountStruct{}).
			Limit(pageSize).
			Offset(offset).
			Find(&discounts).Error

	} else if searchid > 0 {
		// 查询特定记录
		err = r.db.WithContext(ctx).
			Model(&paymentmodels.DiscountStruct{}).
			Where("discountrule_id = ?", searchid).
			Limit(pageSize).
			Offset(offset).
			Find(&discounts).Error
	}

	if err != nil {
		log.Println("GetDiscountinfoRepo:", err)
		return nil, -1, err
	}

	// for _, d := range discount {
	// 	log.Printf("Discount: %+v", *d) // 解引用指针，打印具体内容
	// }

	// 获取总记录数
	totalNum, err := r.GetDiscountinfoCountRepo(ctx, searchid)
	if err != nil {
		return nil, -1, err
	}

	return discounts, totalNum, nil
}

func (r *PaymentRepository) GetDiscountinfoCountRepo(ctx context.Context, searchid int) (int, error) {
	var count int64
	var err error

	// 如果 searchid 为 0，则查询所有记录
	if searchid == 0 {
		err = r.db.WithContext(ctx).
			Model(&paymentmodels.DiscountStruct{}).
			Count(&count).Error
	} else if searchid > 0 {
		count = 1
	}

	if err != nil {
		log.Println("GetDiscountinfoCountRepo:", err)
		return -1, err
	}

	return int(count), nil
}

func (r *PaymentRepository) InsertDiscountInfoRepo(ctx context.Context, discount *paymentmodels.DiscountStruct) error {
	err := r.db.WithContext(ctx).Create(discount).Error
	if err != nil {
		log.Println("InsertDiscountInfoRepo:", err)
		return err
	}
	return nil
}

func (r *PaymentRepository) UpdateDiscountInfoRepo(ctx context.Context, discount *paymentmodels.DiscountStruct) error {
	err := r.db.WithContext(ctx).Save(discount).Error
	if err != nil {
		log.Println("UpdateDiscountInfoRepo:", err)
		return err
	}
	return nil
}

func (r *PaymentRepository) DeleteDiscountInfoRepo(ctx context.Context, ids []int) error {
	if len(ids) == 0 {
		return nil // 如果没有提供 ID，直接返回 nil
	}

	// 执行批量删除
	err := r.db.WithContext(ctx).
		Where("discountrule_id IN ?", ids).
		Delete(&paymentmodels.DiscountStruct{}). // 确保使用正确的模型
		Error

	if err != nil {
		log.Println("DeleteDiscountInfoRepo:", err)
		return err
	}
	return nil
}

func (r *PaymentRepository) InsertDiscountTypeInfoRepo(ctx context.Context, discountType []*paymentmodels.DiscountTypeStruct) error {
	err := r.db.WithContext(ctx).Create(discountType).Error
	if err != nil {
		log.Println("InsertDiscountTypeInfoRepo:", err)
		return err
	}
	return nil
}
func (r *PaymentRepository) GetDiscountTypeInfoRepo(ctx context.Context, searchid int, page int) ([]*paymentmodels.DiscountTypeStruct, int, error) {
	const pageSize = 10 // 每页的大小
	var discountType []*paymentmodels.DiscountTypeStruct
	var err error
	var totalNum int64

	// 计算偏移量
	offset := (page - 1) * pageSize

	if searchid == 0 {
		err = r.db.WithContext(ctx).
			Model(&paymentmodels.DiscountTypeStruct{}).
			Count(&totalNum).Error
		if err != nil {
			log.Println("GetDiscountTypeInfoRepo count error:", err)
			return nil, -1, err
		}
		// 查询所有记录
		err = r.db.WithContext(ctx).
			Model(&paymentmodels.DiscountTypeStruct{}).
			Limit(pageSize).
			Offset(offset).
			Find(&discountType).Error
	} else {
		// 查询特定记录
		err = r.db.WithContext(ctx).
			Model(&paymentmodels.DiscountTypeStruct{}).
			Where("type_id = ?", searchid). // 假设 id 是 DiscountTypeStruct 的主键
			Limit(pageSize).
			Offset(offset).
			Find(&discountType).Error

		totalNum = 1
	}

	if err != nil {
		log.Println("GetDiscountTypeInfoRepo:", err)
		return nil, -1, err
	}

	return discountType, int(totalNum), nil
}
