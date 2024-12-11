package vip

// 查询单个VIP会员
// 修改VIP会员信息

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	vipmodels "mygopro/internal/vip/models"

	_ "github.com/go-sql-driver/mysql"
)

// 查询单个VIP会员
type VipRepository struct {
	db *sql.DB
}

func NewVipRepository(db *sql.DB) *VipRepository {
	// 构造函数
	return &VipRepository{
		db: db,
	}
}

// FindByVipPhone是VipRepository的方法
func (r *VipRepository) FindByVipPhone(ctx context.Context, vipphone string) (*vipmodels.VIP, error) {
	var vip vipmodels.VIP
	err := r.db.QueryRowContext(ctx, "SELECT * FROM vipmember_data WHERE Phone = ?", vipphone).
		Scan(
			&vip.VIPID,
			&vip.FirstName,
			&vip.LastName,
			&vip.Phone,
			&vip.JoinDate,
			&vip.NowPoints,
			&vip.UsedPoints,
			&vip.RegiHandler,
		)
	if err != nil {
		return nil, err
	}
	return &vip, nil
}

// 修改VIP会员信息
func (r *VipRepository) UpdatePointsByPhone(
	ctx context.Context,
	phone string,
	value int,
	updateNowPoints bool,
	updateUsedPoints bool) (int64, error) {
	// 参数验证
	if phone == "" {
		return 0, fmt.Errorf("会员电话号码不能为空")
	}
	var query string
	var args []interface{}
	// 根据需要构建 SQL 查询
	if updateNowPoints && !updateUsedPoints {

		query = `UPDATE vipmember_data SET NowPoints = NowPoints + ? WHERE Phone = ?`
		args = []interface{}{value, phone}

	} else if updateUsedPoints && !updateNowPoints {

		query = `UPDATE vipmember_data SET NowPoints = Nowpoints - ?, UsedPoints = UsedPoints + ? WHERE Phone= ?`
		args = []interface{}{value, value, phone}

	} else {
		return 0, fmt.Errorf("请确定修改字段。")
	}
	// fmt.Printf("即将执行的 SQL: %s, 参数: %v\n", query, args)

	result, err := r.db.Exec(query, args...)
	if err != nil {
		log.Printf("更新VIP信息失败: %v", err)
		return 0, err
	}

	// 获取受影响的行数
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Printf("获取受影响的行数失败: %v", err)
		return 0, err
	}

	return rowsAffected, nil
}
