package vip

import (
	"context"
	"fmt"

	vipmodels "mygo/vip/models"
	viprepo "mygo/vip/repositories"
)

type VipService struct {
	viprepo *viprepo.VipRepository
}

func NewVipService(viprepo *viprepo.VipRepository) *VipService {
	return &VipService{
		viprepo: viprepo,
	}
}

func (s *VipService) GetVipInfoServ(ctx context.Context, id string) (*vipmodels.VIP, error) {
	if id == "" {
		return nil, fmt.Errorf("会员信息不能为空")
	}
	vip, err := s.viprepo.FindVipRepo(ctx, id)
	if err != nil {
		fmt.Println("GetVipInfoServ出错3", err)
		return nil, err
	}
	fmt.Println("GetVipInfoServ_vipStruct", vip)
	return vip, nil
}

func (s *VipService) UpdatePointsInfoServ(
	ctx context.Context,
	phone string,
	value int,
	updateNowPoints bool,
	updateUsedPoints bool) (*vipmodels.VIP, error) {

	if phone == "" {
		return nil, fmt.Errorf("会员电话号码不能为空")
	}

	vipdata, err := s.viprepo.FindVipRepo(ctx, phone)
	if err != nil {
		fmt.Println("UpdatePointsInfoServ出错1", err)
		return nil, err
	}
	if vipdata.NowPoints-float64(value) < 0 && updateUsedPoints {
		return nil, fmt.Errorf("会员积分不足")
	}
	// 更新会员积分(增加消费)
	_, err = s.viprepo.UpdatePointsRepo(ctx, phone, value, updateNowPoints, updateUsedPoints)

	vipdata, err = s.viprepo.FindVipRepo(ctx, phone)
	if err != nil {
		fmt.Println("UpdatePointsInfoServ出错2", err)
		return nil, err
	}

	return vipdata, err

}
