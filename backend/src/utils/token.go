package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v4" // 确保使用正确的包
)

type jwtTokenStruct struct {
	Name     string `json:"name"`
	Password string `json:"password"`
	jwt.RegisteredClaims
}

// 生成token
func GenerateToken(name string, password string) (string, error) {
	claims := jwtTokenStruct{
		Name:     name,
		Password: password,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // 设置过期时间
			IssuedAt:  jwt.NewNumericDate(time.Now()),                     // 设置签发时间
			Subject:   "login",                                            // 设置主题
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte("loginkey")) // 使用安全的密钥
}

// 解析token
func ParseToken(tokenString string) (jwtTokenStruct, error) {
	ijwtTokenStruct := jwtTokenStruct{}
	token, err := jwt.ParseWithClaims(tokenString, &ijwtTokenStruct, func(token *jwt.Token) (interface{}, error) {
		return []byte("loginkey"), nil
	})
	if err == nil && !token.Valid {
		err = errors.New("token解析失败")
	}
	return ijwtTokenStruct, err
}

// 检查token
func isTokenVlid(tokenString string) bool {
	_, err := ParseToken(tokenString)
	if err != nil {
		return false
	}
	return true
}
