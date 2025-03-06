package payment

import (
	"context"
	paymentmodels "mygo/payment/models"
	payrepo "mygo/payment/repositories"
)

type PaymentService struct {
	paymentgormrepo *payrepo.PaymentRepository
}

func NewPaymentService(paymentrepo *payrepo.PaymentRepository) *PaymentService {
	return &PaymentService{
		paymentgormrepo: paymentrepo,
	}
}

func (s *PaymentService) GetDiscountinfoServ(ctx context.Context, searchid int, page int) ([]*paymentmodels.DiscountStruct, int, error) {
	discounts, totalnum, err := s.paymentgormrepo.GetDiscountinfoRepo(ctx, searchid, page)
	if err != nil {
		return nil, -1, err
	}
	var discountValues []paymentmodels.DiscountStruct
	for _, d := range discounts {
		discountValues = append(discountValues, *d) // 解引用指针
	}

	return discounts, totalnum, nil
}

func (s *PaymentService) InsertDiscountInfoServ(ctx context.Context, discount *paymentmodels.DiscountStruct) error {
	err := s.paymentgormrepo.InsertDiscountInfoRepo(ctx, discount)
	if err != nil {
		return err
	}
	return nil
}

func (s *PaymentService) UpdateDiscountInfoServ(ctx context.Context, discount *paymentmodels.DiscountStruct) error {
	err := s.paymentgormrepo.UpdateDiscountInfoRepo(ctx, discount)
	if err != nil {
		return err
	}
	return nil
}

func (s *PaymentService) DeleteDiscountInfoServ(ctx context.Context, ids []int) error {
	err := s.paymentgormrepo.DeleteDiscountInfoRepo(ctx, ids)
	if err != nil {
		return err
	}
	return nil
}

func (s *PaymentService) InsertDiscountTypeInfoServ(ctx context.Context, discountType []*paymentmodels.DiscountTypeStruct) error {
	err := s.paymentgormrepo.InsertDiscountTypeInfoRepo(ctx, discountType)
	if err != nil {
		return err
	}
	return nil
}

func (s *PaymentService) GetDiscountTypeInfoServ(ctx context.Context, id int, page int) ([]*paymentmodels.DiscountTypeStruct, int, error) {
	discountType, total_num, err := s.paymentgormrepo.GetDiscountTypeInfoRepo(ctx, id, page)
	if err != nil {
		return nil, -1, err
	}
	return discountType, total_num, nil
}
