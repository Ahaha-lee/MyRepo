package vip

import (
	"context"
	"fmt"
	vipmodels "mygo/vip/models"
)

func (r *VipRepository) GetVIPInfoRepo(ctx context.Context) ([]vipmodels.VIP, error) {
	query := "SELECT * FROM vipmembersdata"
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		fmt.Println("GetVIPInfoRepo出错1", err)
		return nil, err
	}
	defer rows.Close()
	var vips []vipmodels.VIP
	for rows.Next() {
		var vip vipmodels.VIP
		// 扫描当前行到结构体
		if err := rows.Scan(
			&vip.VIPID,
			&vip.Name,
			&vip.Phone,
			&vip.JoinDate,
			&vip.NowPoints,
			&vip.UsedPoints,
			&vip.RegiHandler,
		); err != nil {
			fmt.Println("GetVIPInfoRepo出错2", err)
			return nil, err
		}
		// 将当前结构体添加到切片中
		vips = append(vips, vip)
	}

	if err := rows.Err(); err != nil {
		fmt.Println("GetVIPInfoRepo出错3", err)
		return nil, err
	}
	return vips, nil
}
