package login

import (
	"database/sql"
	"fmt"
	loginModels "mygo/login/models"

	"context"
)

type LoginRepository struct {
	db *sql.DB
}

func NewLoginRepository(db *sql.DB) *LoginRepository {
	// 构造函数
	return &LoginRepository{
		db: db,
	}
}

func (r *LoginRepository) RegisterRepo(ctx context.Context, input *loginModels.Registerinput) error {

	var count int

	err := r.db.QueryRow("SELECT COUNT(*) FROM employees WHERE Phone = ?", input.Phone).Scan(&count)
	if err != nil {
		fmt.Println("RegisterRepo出错1:", err)
		return err
	}
	if count > 0 {
		fmt.Println("该手机号已注册, 账号已存在")
		return fmt.Errorf("该手机号已注册, 账号已存在")
	}

	_, err = r.db.Exec("INSERT INTO employees (Name, Phone, Password, Birthday, DateOfEntry, Gender,RoleID, Position, PositionState) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)",
		input.Name,
		input.Phone,
		input.Password,
		input.Birthday,
		input.DateOfEntry,
		input.Gender,
		input.RoleID,
		input.Position,
		input.PositionState)
	if err != nil {
		fmt.Println("RegisterRepo出错2:", err)
		return err
	}
	return nil
}
