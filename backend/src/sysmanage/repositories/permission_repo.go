package sysmanage

import (
	"context"
	"log"
	sysmodels "mygo/sysmanage/models"

	"gorm.io/gorm"
)

type SystemMamageRepo struct {
	db *gorm.DB
}

func NewSystemMamageRepo(db *gorm.DB) *SystemMamageRepo {
	return &SystemMamageRepo{db: db}
}

func (repo *SystemMamageRepo) GetPermissionList(ctx context.Context, searchid int) ([]*sysmodels.Permission, int, error) {
	var permissions []*sysmodels.Permission
	var err error

	// 执行查询
	if searchid == 0 {
		// 查询所有记录
		err = repo.db.
			Model(&[]sysmodels.Permission{}).
			Find(&permissions).Error
	} else if searchid > 0 {
		// 查询特定记录
		err = repo.db.
			Model(&sysmodels.Permission{}).
			Where("permission_id = ?", searchid).
			Find(&permissions).Error
	}

	if err != nil {
		log.Println("GetList:", err)
		return nil, -1, err
	}

	// 获取总记录数
	totalNum, err := repo.GetPermissionCount(searchid)
	if err != nil {
		return nil, -1, err
	}

	return permissions, int(totalNum), nil
}

// GetPermissionCount 方法用于获取权限记录的总数
func (repo *SystemMamageRepo) GetPermissionCount(searchid int) (int64, error) {
	var count int64
	var err error
	if searchid == 0 {
		// 查询所有记录的总数
		err = repo.db.Model(&sysmodels.Permission{}).Count(&count).Error
	} else if searchid > 0 {
		// 查询特定记录的总数
		err = repo.db.Model(&sysmodels.Permission{}).Where("id = ?", searchid).Count(&count).Error
	}
	return count, err
}

func (repo *SystemMamageRepo) GetPermissionAndRoleInfoRepo(ctx context.Context) ([]*sysmodels.EmployeeRolePermission, error) {
	var employeeRolePermissions []*sysmodels.EmployeeRolePermission
	err := repo.db.Model(&sysmodels.EmployeeRolePermission{}).Find(&employeeRolePermissions).Error
	if err != nil {
		log.Println("GetPermissionAndRoleInfoRepo:", err)
		return nil, err
	}
	return employeeRolePermissions, nil
}
