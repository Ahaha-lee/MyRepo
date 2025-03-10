package sysmanage

import (
	"context"
	"log"
	sysmodels "mygo/sysmanage/models"
)

// CreateRole 新增角色
func (r *SystemMamageRepo) CreateRole(role *sysmodels.Role) error {
	return r.db.Create(role).Error
}

// GetRoles 分页查询角色列表
func (r *SystemMamageRepo) GetRoleList(con context.Context, search_id int) ([]*sysmodels.Role, error) {
	var roles []*sysmodels.Role
	var err error

	if search_id == 0 {
		err = r.db.
			Model(&[]sysmodels.Role{}).
			Find(&roles).Error
	} else if search_id > 0 {
		// 查询特定记录
		err = r.db.
			Model(&sysmodels.Role{}).
			Where("role_id = ?", search_id).
			Find(&roles).Error
	}
	if err != nil {
		log.Println("GetRoleList:", err)
		return nil, err
	}
	return roles, nil
}

// UpdateRole 更新角色信息
func (r *SystemMamageRepo) UpdateRole(role *sysmodels.Role) error {
	return r.db.Save(role).Error
}

// DeleteRole 根据 ID 删除角色
func (r *SystemMamageRepo) DeleteRole(id uint) error {
	return r.db.Delete(&sysmodels.Role{}, id).Error
}
