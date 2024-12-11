package vip

// 插入会员信息
// 删除会员信息
import (
	"context"
	"fmt"
	vipmodels "mygo/vip/models"

	_ "github.com/go-sql-driver/mysql"
)

func (r *VipRepository) InsertVIPinfoRepo(ctx context.Context, newvip *vipmodels.VIP) error {
	var count int
	query2 := "SELECT COUNT(*) FROM vipmember_data WHERE Phone = ?"
	err := r.db.QueryRowContext(ctx, query2, newvip.Phone).Scan(&count)
	if err != nil {
		fmt.Println("InsertVIPinfoRepo出错1", err)
		return err
	} else if count > 0 {
		return fmt.Errorf("该手机号已存在")
	}

	query := "INSERT INTO vipmember_data (Name, Phone,NowPoints, UsedPoints,RegiHandler) VALUES ( ?, ?,?, ?, ?)"
	_, err = r.db.Exec(query, newvip.Name, newvip.Phone, 0, 0, newvip.RegiHandler)
	if err != nil {
		fmt.Println("InsertVIPinfoRepo出错1", err)
		return fmt.Errorf("插入VIP信息失败")
	}
	return nil
}

// 删除会员信息
func (r *VipRepository) DeleteVIPInfoRepo(ctx context.Context, vipPhone string) (int64, error) {
	var count int
	err := r.db.QueryRow("SELECT COUNT(*) FROM vipmember_data WHERE Phone=?", vipPhone).Scan(&count)
	if err != nil {
		fmt.Println("DeleteVIPInfo出错1:查询失败 ", err)
		return 0, err
	} else if count == 0 {
		fmt.Println("DeleteVIPInfo出错2:该会员不存在")
		return 0, fmt.Errorf("该会员不存在")
	}

	query := "DELETE FROM vipmember_data WHERE Phone=?"
	result, err := r.db.Exec(query, vipPhone)
	if err != nil {
		fmt.Println("DeleteVIPInfo出错3：删除VIP信息失败: ", err)
		return 0, err
	}

	// 获取受影响的行数
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		fmt.Println("DeleteVIPInfo出错4：获取受影响的行数失败: ", err)
		return 0, err
	}

	return rowsAffected, nil
}
