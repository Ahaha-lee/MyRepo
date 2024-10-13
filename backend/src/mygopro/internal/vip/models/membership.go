package vip

// RegiVIP 结构体，用于保存 VIP 会员信息
type RegiVIP struct {
	FirstName   string `json:"firstname"`
	LastName    string `json:"lastname"`
	Phone       string `json:"phone"`
	JoinDate    string `json:"joindate"`
	RegiHandler string `json:"regihandler"`
}
