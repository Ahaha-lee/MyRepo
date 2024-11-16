package vip

// 查询单个VIP会员
// 修改VIP会员信息

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	vipmodels "mygo/vip/models"

	_ "github.com/go-sql-driver/mysql"
)

type VipRepository struct {
	db *sql.DB
}

func NewVipRepository(db *sql.DB) *VipRepository {
	// 构造函数
	return &VipRepository{
		db: db,
	}
}

// 查找会员信息
func (r *VipRepository) FindVipRepo(ctx context.Context, id string) (*vipmodels.VIP, error) {
	var vip vipmodels.VIP
	err := r.db.QueryRowContext(ctx, "SELECT * FROM vipmembersdata WHERE Phone = ? or Name = ?", id, id).
		Scan(
			&vip.VIPID,
			&vip.Name,
			&vip.Phone,
			&vip.JoinDate,
			&vip.NowPoints,
			&vip.UsedPoints,
			&vip.RegiHandler,
		)
	if err != nil {
		fmt.Println("FindVipRepo出错1", err)
		if sql.ErrNoRows == err {
			return nil, fmt.Errorf("该用户不存在")
		}
		return nil, err
	}
	return &vip, nil
}

// 修改VIP会员分数
func (r *VipRepository) UpdatePointsRepo(
	ctx context.Context,
	phone string,
	value int,
	updateNowPoints bool,
	updateUsedPoints bool) (int64, error) {
	// 参数验证
	if phone == "" {
		return 0, fmt.Errorf("UpdatePointsRepo出错1 ；会员电话号码不能为空")
	}
	var query string
	var args []interface{}

	// 根据需要构建 SQL 查询
	if updateNowPoints && !updateUsedPoints {

		query = `UPDATE vipmembersdata SET NowPoints = NowPoints + ? WHERE Phone = ?`
		args = []interface{}{value, phone}

	} else if updateUsedPoints && !updateNowPoints {

		query = `UPDATE vipmembersdata SET NowPoints = Nowpoints - ?, UsedPoints = UsedPoints + ? WHERE Phone= ?`
		args = []interface{}{value, value, phone}

	} else {
		return 0, fmt.Errorf("UpdatePointsRepo出错2：请确定修改字段。")
	}

	result, err := r.db.Exec(query, args...)
	if err != nil {
		log.Println("UpdatePointsRepo出错3：更新VIP信息失败: ", err)
		return 0, err
	}

	// 获取受影响的行数
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Println("UpdatePointsRepo出错4：获取受影响的行数失败:", err)
		return 0, err
	}

	return rowsAffected, nil
}
