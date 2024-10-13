package vip

import (
	"database/sql"
	"encoding/json"
	"fmt"
	vipmodels "mygopro/internal/vip/models"
	vipserv "mygopro/internal/vip/service"
	sharedutils "mygopro/utils"

	"net/http"
)

// 有接受者 方法
type VipController struct {
	vipService *vipserv.VipService
}

func NewVipController(vipService *vipserv.VipService) *VipController {
	return &VipController{
		vipService: vipService,
	}
}

func (c *VipController) GetVipHandler(w http.ResponseWriter, r *http.Request) {
	sharedutils.HandleCORS(w, r)

	if r.Method != http.MethodGet {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}

	vipphone := r.URL.Query().Get("vipphone")
	// 调用 service 层获取会员信息
	member, err := c.vipService.GetVipInfo(r.Context(), vipphone)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "没有找到指定的 VIP", http.StatusNotFound)
			return
		}
		fmt.Println(member)
		fmt.Println("查询 VIP 信息失败", err)
		http.Error(w, "查询 VIP 信息失败", http.StatusInternalServerError)
		return
	}

	// 将会员信息转换为 JSON 格式并返回
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(member); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// 会员积分修改处理程序
func (c *VipController) UpdateVIPHandler(w http.ResponseWriter, r *http.Request) {

	sharedutils.HandleCORS(w, r)
	if r.Method != http.MethodPut {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}

	requstruct, _ := sharedutils.RequestOperation[vipmodels.UpdatePointsRequest](w, r)
	//获取会员信息
	VIP, err := c.vipService.GetVipInfo(r.Context(), requstruct.Phone)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "没有找到指定的 VIP", http.StatusNotFound)
			return
		}
		http.Error(w, "查询 VIP 信息失败", http.StatusInternalServerError)
		return
	}
	fmt.Println("VIP信息", VIP)
	// 修改会员积分
	row, err := c.vipService.UpdatePointsInfo(r.Context(), requstruct.Phone, requstruct.Value, requstruct.UpdateNowPoints, requstruct.UpdateUsedPoints)
	if err != nil {
		http.Error(w, "更新VIP信息失败", http.StatusInternalServerError)
		fmt.Printf("获取受影响行数失败: %v", err)
		return
	}
	if row == 0 {
		http.Error(w, "没有找到要更新的VIP", http.StatusNotFound)
		return
	}
}
