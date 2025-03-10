package sysmanage

// 角色结构体
type Role struct {
	RoleId   float64 `gorm:"autoIncrement:true"`
	RoleName string
	RoleDesc string
}

// 权限结构体
type Permission struct {
	PermissionId       float64
	PermissionCategory string
	PermissionName     string
	PermissionDesc     string
}

// 角色权限用户账号联系
type EmployeeRolePermission struct {
	RoleId       float64
	PermissionId float64
}

type PermissionAndRoleRelation struct {
	Rolename       string
	Permissionname []string
}
