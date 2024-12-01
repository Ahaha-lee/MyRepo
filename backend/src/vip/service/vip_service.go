package vip

import (
	"context"
	"fmt"
	vipmodels "mygo/vip/models"
)

func (s *VipService) GetVIPInfoServ(ctx context.Context) ([]vipmodels.VIP, error) {
	vip, err := s.viprepo.GetVIPInfoRepo(ctx)
	if err != nil {
		fmt.Println("GetVIPInfoServ出错1", err)
		return nil, err
	}
	return vip, nil
}
