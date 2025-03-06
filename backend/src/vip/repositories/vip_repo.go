package vip

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	vipmodels "mygo/vip/models"

	"gorm.io/gorm"
)

func (r *VipRepository) GetVIPInfoRepo(ctx context.Context, id int, page int) ([]vipmodels.VIP, int, error) {
	var count int
	var rows *sql.Rows
	var err error

	if id == 0 {
		// 查询总数
		query1 := `SELECT COUNT(*) FROM vipmember_data`
		err = r.db.QueryRow(query1).Scan(&count)
		if err != nil {
			fmt.Println("GetVIPInfoRepo出错4", err)
			return nil, -1, err
		}

		// 分页查询，同时连接 vip_grade_rules 表获取 grade_name
		query := `
            SELECT vmd.*, vgr.grade_name AS GradeName
            FROM vipmember_data AS vmd
            LEFT JOIN vip_grade_rules AS vgr ON vmd.Grade = vgr.grade_id
            LIMIT ?, ?
        `
		offset := (page - 1) * 10
		rows, err = r.db.QueryContext(ctx, query, offset, 10)
		if err != nil {
			fmt.Println("GetVIPInfoRepo出错5", err)
			return nil, -1, err
		}
	} else if id > 0 {
		query := `
            SELECT vmd.*, vgr.grade_name AS GradeName
            FROM vipmember_data AS vmd
            LEFT JOIN vip_grade_rules AS vgr ON vmd.Grade = vgr.grade_id
            WHERE vmd.VipId = ?
        `
		rows, err = r.db.QueryContext(ctx, query, id)
		if err != nil {
			fmt.Println("GetVIPInfoRepo出错2", err)
			return nil, -1, err
		}
		count = 1
	}

	defer rows.Close()

	var vips []vipmodels.VIP
	for rows.Next() {
		var vip vipmodels.VIP
		if err := rows.Scan(
			&vip.VipId,
			&vip.Name,
			&vip.Phone,
			&vip.JoinDate,
			&vip.Grade,
			&vip.NowPoints,
			&vip.UsedPoints,
			&vip.RegiHandler,
			&vip.GradeName,
		); err != nil {
			fmt.Println("GetVIPInfoRepo出错2", err)
			return nil, -1, err
		}
		vips = append(vips, vip)
	}

	if err := rows.Err(); err != nil {
		fmt.Println("GetVIPInfoRepo出错3", err)
		return nil, -1, err
	}
	return vips, count, nil
}

// func (r *VipRepository) GetTotalNumber(ctx context.Context,total int) error {

// 	query:=select count(*) from
// }

// 利用GORM便利数据库操作

type VipGormRepository struct {
	db *gorm.DB
}

func NewVipGormRepository(db *gorm.DB) *VipGormRepository {
	// 构造函数
	return &VipGormRepository{
		db: db,
	}
}
func (r *VipGormRepository) GetCurrentRuleId(ctx context.Context) (int, error) {
	var maxRuleId int
	if err := r.db.WithContext(ctx).Model(&vipmodels.GradeStruct{}).Select("COALESCE(MAX(rule_id), 0)").Scan(&maxRuleId).Error; err != nil {
		return 0, err
	}
	return maxRuleId, nil
}

func (r *VipGormRepository) InsertNewGradesRuleRepo(ctx context.Context, grades []vipmodels.GradeStruct) error {
	// 获取当前最大的 rule_id
	currentRuleId, err := r.GetCurrentRuleId(ctx)
	if err != nil {
		log.Println("InsertNewGradesRuleRepo1", err)
		return err
	}

	newRuleId := currentRuleId + 1

	tx := r.db.WithContext(ctx).Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	for _, grade := range grades {
		// 为每个新记录设置新的 rule_id
		grade.RuleId = newRuleId

		// 插入新的记录
		if err := tx.Create(&grade).Error; err != nil {
			tx.Rollback() // 如果插入失败，回滚事务
			return err
		}
	}

	return tx.Commit().Error // 提交事务
}

func (r *VipGormRepository) GetNewGradesRuleRepo(ctx context.Context) ([]vipmodels.GradeStruct, int, error) {
	var grades []vipmodels.GradeStruct

	maxRuleId, err := r.GetCurrentRuleId(ctx)
	if err != nil {
		log.Println("GetNewGradesRuleRepo1", err)
		return nil, -1, err
	}

	// 根据最大ruleid的值查询所有相同ruleid的记录
	err = r.db.WithContext(ctx).Where("rule_id =?", maxRuleId).Find(&grades).Error
	if err != nil {
		return nil, -1, err
	}
	return grades, maxRuleId, nil
}
