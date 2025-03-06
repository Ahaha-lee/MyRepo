package sysmanage

import (
	sysrepo "mygo/sysmanage/repositories"
)

type SystemMamageService struct {
	sysmanageservice *sysrepo.SystemMamageRepo
}

func NewSystemMamageService(sysmanageservice *sysrepo.SystemMamageRepo) *SystemMamageService {
	return &SystemMamageService{
		sysmanageservice: sysmanageservice,
	}
}

// func (s *SystemMamageService) GetRoleInfoServ(ctx context.Context, roleid int, page int) ([]*sysmodels.Role, int, error) {

// }
