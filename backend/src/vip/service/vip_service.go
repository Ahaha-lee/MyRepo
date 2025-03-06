package vip

import (
	"context"
	"fmt"
	"log"
	vipmodels "mygo/vip/models"
	viprepo "mygo/vip/repositories"
)

func (s *VipService) GetVIPInfoServ(ctx context.Context, id int, page int) ([]vipmodels.VIP, int, error) {
	vip, total, err := s.viprepo.GetVIPInfoRepo(ctx, id, page)
	if err != nil {
		fmt.Println("GetVIPInfoServ出错1", err)
		return nil, -1, err
	}
	return vip, total, nil
}

//利用GORM

type VipGormService struct {
	vipgormrepo *viprepo.VipGormRepository
}

func NewVipGormService(vipgormrepo *viprepo.VipGormRepository) *VipGormService {
	return &VipGormService{
		vipgormrepo: vipgormrepo,
	}
}

func (s *VipGormService) InsertNewGradesRuleServ(ctx context.Context, grades []vipmodels.GradeStruct) error {
	err := s.vipgormrepo.InsertNewGradesRuleRepo(ctx, grades)
	if err != nil {
		log.Println("InsertNewGradesRuleServ出错", err)
		return err
	}
	return nil
}

func (s *VipGormService) GetNewGradesRuleServ(ctx context.Context) ([]vipmodels.GradeStruct, int, error) {
	grades, ruleid, err := s.vipgormrepo.GetNewGradesRuleRepo(ctx)
	if err != nil {
		log.Println("GetNewGradesRuleServ出错", err)
		return nil, -1, err
	}
	return grades, ruleid, nil
}
