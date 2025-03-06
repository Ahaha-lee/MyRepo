package vip

type VIP struct {
	VipId       string  `json:"vipid"`
	Name        string  `json:"name"`
	Phone       string  `json:"phone"`
	JoinDate    string  `json:"joindate"`
	Grade       string  `json:"grade"`
	NowPoints   float64 `json:"nowpoints"`
	UsedPoints  float64 `json:"usedpoints"`
	RegiHandler string  `json:"regihandler"`
	GradeName   string  `json:"gradename"`
}

// 修积分请求体结构体
type UpdatePointsRequest struct {
	Value            int  `json:"value"`            // 要修改的分数
	UpdateNowPoints  bool `json:"updateNowPoints"`  // 是否更新NowPoints
	UpdateUsedPoints bool `json:"updateUsedPoints"` // 是否更新UsedPoints
}

type GradeStruct struct {
	GradeId          int `gorm:"autoIncrement:true"`
	RuleId           int `gorm:"autoIncrement:true"`
	GradeName        string
	GradeStartpoints int
	GradeEndpoints   int
	GradeRemarks     string
}

func (GradeStruct) TableName() string { return "vip_grade_rules" }
