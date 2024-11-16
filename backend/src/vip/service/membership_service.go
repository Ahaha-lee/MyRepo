package vip

import (
	"context"
	"fmt"
	"log"

	vipmodels "mygo/vip/models"
)

func (s *VipService) RegistervipServ(ctx context.Context, newvip *vipmodels.VIP) error {
	if newvip.Name == "" || newvip.Phone == "" {
		return fmt.Errorf("会员注册信息不能为空")
	}
	// 新会员注册
	err := s.viprepo.InsertVIPinfoRepo(ctx, newvip)

	if err != nil {
		log.Println("RegistervipServ出错1：", err)
		return err
	}

	return nil

}

func (s *VipService) DeleteVIPServ(ctx context.Context, vipphone string) (int64, error) {
	if vipphone == "" {
		return 0, fmt.Errorf("会员手机号不能为空")
	}
	rowsAffected, err := s.viprepo.DeleteVIPInfoRepo(ctx, vipphone)
	if err != nil {
		log.Println("DeleteVIPServc出错1:service删除会员失败", err)
		return 0, err
	}
	return rowsAffected, err
}
