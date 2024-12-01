package login

import (
	"context"
	"fmt"
)

func (r *LoginRepository) LoginRepo(ctx context.Context, id int, password string) (string, error) {

	var count int
	var name string
	err := r.db.QueryRow("SELECT Name, COUNT(*) FROM employees WHERE EmployeeID = ? AND Password = ? GROUP BY Name", id, password).Scan(&name, &count)
	if err != nil {
		fmt.Println("LoginRepo出错1:", err)
		return "", err
	}
	fmt.Println("name", name)
	if count == 0 {
		fmt.Println("账号或密码错误")
		return "", fmt.Errorf("账号或密码错误")
	}
	return name, nil
}
