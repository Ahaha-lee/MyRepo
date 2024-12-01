package login

import "database/sql"

type Registerinput struct {
	Name          string         `json:"name" `
	Password      string         `json:"password" `
	Gender        string         `json:"gender"`
	RoleID        string         `json:"roleID"`
	Position      sql.NullString `json:"position"`
	Birthday      sql.NullString `json:"birthday" `
	Phone         string         `json:"phone"`
	DateOfEntry   sql.NullString `json:"dateOfEntry"`
	PositionState sql.NullString `json:"positionState"`
}

type Logininput struct {
	EmployeeID int    `json:"employeeID"`
	Password   string `json:"password" `
}
