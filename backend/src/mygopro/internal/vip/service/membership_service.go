package vip

import (
	"context"
	"fmt"

	vipmodels "mygopro/internal/vip/models"
)

func (s *VipService) Registervip(ctx context.Context, newvip vipmodels.VIP) (string, error) {
	// 新会员注册

	newvipid, err := s.viprepo.InsertData(ctx, newvip)

	if err != nil {
		fmt.Println("service会员注册失败")
		return "", err
	}

	return newvipid, nil

}

func (s *VipService) DeleteVIP(ctx context.Context, vipphone string) (int64, error) {
	rowsAffected, err := s.viprepo.DeleteData(ctx, vipphone)
	if err != nil {
		fmt.Println("service删除会员失败")
		return 0, err
	}
	return rowsAffected, err
}
