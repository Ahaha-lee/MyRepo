package vip

// 插入会员信息
// 删除会员信息
import (
	"context"
	"fmt"
	vipmodels "mygopro/internal/vip/models"

	_ "github.com/go-sql-driver/mysql"
)

func (r *VipRepository) InsertData(ctx context.Context, newvip vipmodels.VIP) (string, error) {
	// 获取表中记录数
	var count int
	err := r.db.QueryRow("SELECT COUNT(*) FROM vipmembersdata").Scan(&count)
	if err != nil {
		return "", err
	}

	// 生成新的 VIPID
	vipid := fmt.Sprintf("V%d", count+1)
	newvip.VIPID = vipid
	query := "INSERT INTO vipmembersdata (VIPID, FirstName, LastName, Phone,NowPoints, UsedPoints,RegiHandler) VALUES (?, ?, ?, ?,?, ?, ?)"
	_, err = r.db.Exec(query, newvip.VIPID, newvip.FirstName, newvip.LastName, newvip.Phone, 0, 0, newvip.RegiHandler)
	if err != nil {
		return "", err
	}

	return vipid, nil
}

// 删除会员信息
func (r *VipRepository) DeleteData(ctx context.Context, vipPhone string) (int64, error) {

	query := "DELETE FROM vipmembersdata WHERE Phone= ?"
	result, err := r.db.Exec(query, vipPhone)
	if err != nil {
		return 0, err
	}

	// 获取受影响的行数
	rowsAffected, err := result.RowsAffected()

	if err != nil {
		return 0, err
	}

	return rowsAffected, nil
}
