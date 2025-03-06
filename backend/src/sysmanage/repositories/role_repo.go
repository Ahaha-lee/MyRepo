package sysmanage

import (
	sysmodels "mygo/sysmanage/models"

	"gorm.io/gorm"
)

// CreateRole 新增角色
func (repo *SystemMamageRepo) CreateRole(role *sysmodels.Role) error {
	return repo.db.Create(role).Error
}

// GetRoleByID 根据 ID 查询角色
func (r *SystemMamageRepo) GetRoleByID(id uint) (*sysmodels.Role, error) {
	var role sysmodels.Role
	err := r.db.First(&role, id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &role, nil
}

// GetRoles 分页查询角色列表
func (r *SystemMamageRepo) GetRoles(page, pageSize int) ([]*sysmodels.Role, int64, error) {
	var roles []*sysmodels.Role
	offset := (page - 1) * pageSize

	// 执行查询
	err := r.db.Offset(offset).Limit(pageSize).Find(&roles).Error
	if err != nil {
		return nil, 0, err
	}

	// 获取总记录数
	var total int64
	err = r.db.Model(&sysmodels.Role{}).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	return roles, total, nil
}

// UpdateRole 更新角色信息
func (r *SystemMamageRepo) UpdateRole(role *sysmodels.Role) error {
	return r.db.Save(role).Error
}

// DeleteRole 根据 ID 删除角色
func (r *SystemMamageRepo) DeleteRole(id uint) error {
	return r.db.Delete(&sysmodels.Role{}, id).Error
}
