package vip

// 插入会员信息
// 删除会员信息
import (
	"context"
	"fmt"
	"log"
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

	query := "INSERT INTO vipmember_data (Name, Phone,Grade,NowPoints, UsedPoints,RegiHandler) VALUES ( ?,?,?,?,?,?)"
	_, err = r.db.Exec(query, newvip.Name, newvip.Phone, newvip.Grade, 0, 0, newvip.RegiHandler)
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

// UpdateVIPGradeRepo 更新会员等级
func (r *VipRepository) UpdateVIPGradeRepo(ctx context.Context, vipPhone string) error {
	// 开始事务
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("UpdateVIPGradeRepo出错1: 开始事务失败 %w", err)
	}
	// 确保事务结束时进行回滚或提交
	defer func() {
		if p := recover(); p != nil {
			_ = tx.Rollback()
			panic(p)
		} else if err != nil {
			_ = tx.Rollback()
		} else {
			err = tx.Commit()
		}
	}()

	// 检查会员是否存在
	var count int
	err = tx.QueryRowContext(ctx, "SELECT COUNT(*) FROM vipmember_data WHERE Phone=?", vipPhone).Scan(&count)
	if err != nil {
		return fmt.Errorf("UpdateVIPGradeRepo出错2: 查询会员是否存在失败 %w", err)
	}
	if count == 0 {
		return fmt.Errorf("UpdateVIPGradeRepo出错3: 该会员不存在")
	}

	// 获取 VIP 的 NowPoints 和 UsedPoints 之和
	var nowPoints, usedPoints float64
	err = tx.QueryRowContext(ctx, "SELECT NowPoints, UsedPoints FROM vipmember_data WHERE Phone=?", vipPhone).Scan(&nowPoints, &usedPoints)
	if err != nil {
		return fmt.Errorf("UpdateVIPGradeRepo出错4: 查询积分失败 %w", err)
	}
	totalPoints := nowPoints + usedPoints

	// 查询 graderule 表中 createdate 最新的记录，并根据其他字段进行排序
	var ruleIDs []int
	query := `
        SELECT grade_id 
        FROM vip_grade_rules
        WHERE rule_id = (SELECT MAX(rule_id) FROM vip_grade_rules)
          AND ? BETWEEN grade_startpoints AND grade_endpoints 
        ORDER BY createdate DESC`
	rows, err := tx.QueryContext(ctx, query, totalPoints)
	log.Println("GetCurrentRuleId出错:", totalPoints, ruleIDs)
	if err != nil {
		return fmt.Errorf("UpdateVIPGradeRepo出错5: 查询规则失败 %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var ruleID int
		if err := rows.Scan(&ruleID); err != nil {
			return fmt.Errorf("UpdateVIPGradeRepo出错6: 扫描规则ID失败 %w", err)
		}
		ruleIDs = append(ruleIDs, ruleID)
	}

	if err := rows.Err(); err != nil {
		return fmt.Errorf("UpdateVIPGradeRepo出错7: 遍历规则结果集失败 %w", err)
	}

	if len(ruleIDs) == 0 {
		return fmt.Errorf("UpdateVIPGradeRepo出错8: 没有符合条件的规则")
	}

	// 取第一个符合条件的规则 ID 作为新等级
	newGrade := fmt.Sprintf("%d", ruleIDs[0])

	// 更新会员等级
	updateQuery := "UPDATE vipmember_data SET Grade=? WHERE Phone=?"
	_, err = tx.ExecContext(ctx, updateQuery, newGrade, vipPhone)
	if err != nil {
		return fmt.Errorf("UpdateVIPGradeRepo出错9: 更新VIP等级失败 %w", err)
	}

	return nil
}
