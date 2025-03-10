package sysmanage

import (
	"context"
	"log"
	sysmodels "mygo/sysmanage/models"
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

func (s *SystemMamageService) GetPermissionInfoServ(ctx context.Context, searchid int) ([]sysmodels.Permission, int, error) {
	permission, totalnum, err := s.sysmanageservice.GetPermissionList(ctx, searchid)
	if err != nil {
		log.Panicln("GetPermissionInfoServ:", err)
		return nil, -1, err
	}
	var permissionValues []sysmodels.Permission
	for _, d := range permission {
		permissionValues = append(permissionValues, *d) // 解引用指针
	}

	return permissionValues, totalnum, nil
}

func (s *SystemMamageService) GetRoleInfoServ(ctx context.Context, searchid int) ([]sysmodels.Role, error) {
	roles, err := s.sysmanageservice.GetRoleList(ctx, searchid)
	if err != nil {
		log.Panicln("GetRoleInfoServ:", err)
		return nil, err
	}
	var rolesvalues []sysmodels.Role
	for _, d := range roles {
		rolesvalues = append(rolesvalues, *d)
	}
	return rolesvalues, nil
}
func (s *SystemMamageService) GetPermissionAndRoleInfoServ(ctx context.Context) ([]sysmodels.PermissionAndRoleRelation, error) {
	perandrole, err := s.sysmanageservice.GetPermissionAndRoleInfoRepo(ctx)
	if err != nil {
		log.Println("GetPermissionAndRoleInfoServ:", err)
		return nil, err
	}

	var perandrolevalues []sysmodels.EmployeeRolePermission
	for _, d := range perandrole {
		if d != nil {
			perandrolevalues = append(perandrolevalues, *d)
		}
	}

	permissions, _, err := s.GetPermissionInfoServ(ctx, 0)
	if err != nil {
		log.Println("GetPermissionAndRoleInfoServ 获取权限信息失败:", err)
		return nil, err
	}

	roles, err := s.GetRoleInfoServ(ctx, 0)
	if err != nil {
		log.Println("GetPermissionAndRoleInfoServ 获取角色信息失败:", err)
		return nil, err
	}

	// 构建角色名与权限名的映射
	roleMap := make(map[float64]string)
	for _, role := range roles {
		roleMap[role.RoleId] = role.RoleName
	}

	permissionMap := make(map[float64]string)
	for _, permission := range permissions {
		permissionMap[permission.PermissionId] = permission.PermissionName
	}

	// 构建角色与权限的联系
	relationMap := make(map[string][]string)
	for _, perrole := range perandrolevalues {
		roleName, roleExists := roleMap[perrole.RoleId]
		permissionName, permExists := permissionMap[perrole.PermissionId]
		if roleExists && permExists {
			relationMap[roleName] = append(relationMap[roleName], permissionName)
		}
	}

	// 构建 PermissionAndRoleRelation 切片
	var result []sysmodels.PermissionAndRoleRelation
	for roleName, permissionNames := range relationMap {
		result = append(result, sysmodels.PermissionAndRoleRelation{
			Rolename:       roleName,
			Permissionname: permissionNames,
		})
	}

	// 使用更安全的日志记录方式
	for _, r := range result {
		log.Println("Rolename:", r.Rolename, "Permissionname:", r.Permissionname)
	}

	return result, nil
}
