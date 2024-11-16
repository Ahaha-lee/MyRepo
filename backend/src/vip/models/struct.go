package vip

type VIP struct {
	VIPID       string  `json:"vipid"`
	Name        string  `json:"name"`
	Phone       string  `json:"phone"`
	JoinDate    string  `json:"joindate"`
	NowPoints   float64 `json:"nowpoints"`
	UsedPoints  float64 `json:"usedpoints"`
	RegiHandler string  `json:"regihandler"`
}

// 修积分请求体结构体
type UpdatePointsRequest struct {
	Value            int  `json:"value"`            // 要修改的分数
	UpdateNowPoints  bool `json:"updateNowPoints"`  // 是否更新NowPoints
	UpdateUsedPoints bool `json:"updateUsedPoints"` // 是否更新UsedPoints
}
