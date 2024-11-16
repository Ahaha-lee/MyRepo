package login

import (
	"context"
	"fmt"
)

func (s *LoginService) LoginServ(ctx context.Context, name string, password string) error {

	if name == "" {
		return fmt.Errorf("账号不能为空")
	}
	if password == "" {
		return fmt.Errorf("密码不能为空")
	}
	err := s.loginrepo.LoginRepo(ctx, name, password)
	if err != nil {
		return err
	}
	return nil
}
