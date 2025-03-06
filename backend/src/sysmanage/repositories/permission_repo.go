package sysmanage

import (
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

func (repo *SystemMamageRepo) CreatePermission(permission *sysmodels.Permission) error {
	return repo.db.Create(permission).Error
}

func (repo *SystemMamageRepo) BatchCreatePermission(permissions []sysmodels.Permission) error {
	return repo.db.Create(&permissions).Error
}

func (repo *SystemMamageRepo) GetPermission(id uint) (*sysmodels.Permission, error) {
	var permission sysmodels.Permission
	if err := repo.db.First(&permission, id).Error; err != nil {
		return nil, err
	}
	return &permission, nil
}

func (repo *SystemMamageRepo) UpdatePermission(permission *sysmodels.Permission) error {
	return repo.db.Save(permission).Error
}

func (repo *SystemMamageRepo) DeletePermission(id uint) error {
	return repo.db.Delete(&sysmodels.Permission{}, id).Error
}

func (repo *SystemMamageRepo) BatchDeletePermission(ids []uint) error {
	return repo.db.Delete(&sysmodels.Permission{}, ids).Error
}
func (repo *SystemMamageRepo) GetPermissionList(page, searchid int) ([]*sysmodels.Permission, int, error) {
	const pageSize = 10 // 每页的大小
	var permissions []*sysmodels.Permission
	var err error

	// 计算偏移量
	offset := (page - 1) * pageSize

	// 执行查询
	if searchid == 0 {
		// 查询所有记录
		err = repo.db.
			Model(&[]sysmodels.Permission{}).
			Limit(pageSize).
			Offset(offset).
			Find(&permissions).Error
	} else if searchid > 0 {
		// 查询特定记录
		err = repo.db.
			Model(&sysmodels.Permission{}).
			Where("id = ?", searchid).
			Limit(pageSize).
			Offset(offset).
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
