package order

import (
	"context"
	ordermodel "mygo/order/model"
	orderrepo "mygo/order/repositories"
)

type OrderService struct {
	Ordergormrepo *orderrepo.OrderRepository
}

func NewOrderService(Orderrepo *orderrepo.OrderRepository) *OrderService {
	return &OrderService{
		Ordergormrepo: Orderrepo,
	}
}

func (s *OrderService) InsertOrderServ(ctx context.Context, orderIndex *ordermodel.OrderIndexStruct, orderProducts []ordermodel.OrderProductStruct) error {
	err := s.Ordergormrepo.InsertOrder(ctx, orderIndex, orderProducts)
	if err != nil {
		return err
	}
	return nil
}

func (s *OrderService) GetOrderIndexesServ(ctx context.Context, id int, page int) ([]ordermodel.OrderIndexStruct, int, error) {
	orderIndexes, count, err := s.Ordergormrepo.GetOrderIndexes(ctx, id, page)
	if err != nil {
		return nil, 0, err
	}
	return orderIndexes, count, nil
}

func (s *OrderService) GetOrderProductsServ(ctx context.Context, orderIds int) ([]ordermodel.OrderProductStruct, error) {
	orderProducts, err := s.Ordergormrepo.GetOrderProducts(ctx, orderIds)
	if err != nil {
		return nil, err
	}
	return orderProducts, nil
}
