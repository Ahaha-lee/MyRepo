package login

import (
	"context"
	"fmt"
)

func (s *LoginService) LoginServ(ctx context.Context, id int, password string) (string, error) {

	if id == 0 {
		return "", fmt.Errorf("账号不能为空")
	}
	if password == "" {
		return "", fmt.Errorf("密码不能为空")
	}
	name, err := s.loginrepo.LoginRepo(ctx, id, password)
	if err != nil {
		return "", err
	}
	return name, nil
}
