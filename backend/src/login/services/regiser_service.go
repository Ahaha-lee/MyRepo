package login

import (
	"context"
	"database/sql"
	"fmt"
	loginModels "mygo/login/models"
	loginrepo "mygo/login/repositories"
)

type LoginService struct {
	loginrepo *loginrepo.LoginRepository
}

func NewLoginService(loginrepo *loginrepo.LoginRepository) *LoginService {
	return &LoginService{
		loginrepo: loginrepo,
	}
}

func (s *LoginService) RegisterServ(ctx context.Context, input *loginModels.Registerinput) error {
	// 验证输入参数
	if input.Name == "" {
		return fmt.Errorf("注册账号不能为空")
	}
	if input.Password == "" {
		return fmt.Errorf("注册密码不能为空")
	}
	if input.Phone == "" {
		return fmt.Errorf("手机号不能为空")
	}
	if input.Gender == "" {
		return fmt.Errorf("性别不能为空")
	}
	if input.Birthday.String == "" {
		input.Birthday = sql.NullString{String: "", Valid: false} // 设置为 NULL
	} else {
		input.Birthday.Valid = true // 如果有值，设置为有效
	}
	err := s.loginrepo.RegisterRepo(ctx, input)
	if err != nil {
		fmt.Println("RegisterServ出错1:", err)
		return err
	}
	return nil

}
