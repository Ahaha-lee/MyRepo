package vip

type VIP struct {
	VIPID       string  `json:"vipid"`
	FirstName   string  `json:"firstname"`
	LastName    string  `json:"lastname"`
	JoinDate    string  `json:"joindate"`
	NowPoints   float64 `json:"nowpoints"`
	Phone       string  `json:"phone"`
	UsedPoints  float64 `json:"usedpoints"`
	RegiHandler string  `json:"regihandler"`
}

// 修修积分请求体结构体
type UpdatePointsRequest struct {
	Value            int    `json:"value"`            // 要增加的点数
	Phone            string `json:"phone"`            // 用户的手机号
	UpdateNowPoints  bool   `json:"updateNowPoints"`  // 是否更新NowPoints
	UpdateUsedPoints bool   `json:"updateUsedPoints"` // 是否更新UsedPoints
}
