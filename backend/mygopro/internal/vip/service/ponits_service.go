package vip

import (
	"context"

	vipmodels "mygopro/internal/vip/models"
	viprepo "mygopro/internal/vip/repositories"
)

type VipService struct {
	viprepo *viprepo.VipRepository
}

func NewVipService(viprepo *viprepo.VipRepository) *VipService {
	return &VipService{
		viprepo: viprepo,
	}
}

// 这里的VipRepository里面还包含了前面的函数
func (s *VipService) GetVipInfo(ctx context.Context, vipPhone string) (*vipmodels.VIP, error) {
	// 1. 查询会员信息
	vip, err := s.viprepo.FindByVipPhone(ctx, vipPhone)
	if err != nil {
		return nil, err
	}
	// fmt.Println(vip)
	return vip, nil
}

func (s *VipService) UpdatePointsInfo(
	ctx context.Context,
	phone string,
	value int,
	updateNowPoints bool,
	updateUsedPoints bool) (int64, error) {

	// 更新会员积分(增加消费)
	rowsAffected, err := s.viprepo.UpdatePointsByPhone(ctx, phone, value, updateNowPoints, updateUsedPoints)

	return rowsAffected, err

}
