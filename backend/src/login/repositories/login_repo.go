package login

import (
	"context"
	"fmt"
)

func (r *LoginRepository) LoginRepo(ctx context.Context, name string, password string) error {

	var count int
	err := r.db.QueryRow("SELECT COUNT(*) FROM employees WHERE name = ? AND Password = ?", name, password).Scan(&count)
	if err != nil {
		fmt.Println("LoginRepo出错1:", err)
		return err
	}
	if count == 0 {
		fmt.Println("账号或密码错误")
		return fmt.Errorf("账号或密码错误")
	}
	return nil
}
