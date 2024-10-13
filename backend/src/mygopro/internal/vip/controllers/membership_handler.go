package vip

import (
	"fmt"
	vipmodels "mygopro/internal/vip/models"
	sharedutils "mygopro/utils"
	"net/http"
)

// 存入新会员信息处理程序
func (c *VipController) RegisterVipHandler(w http.ResponseWriter, r *http.Request) {
	sharedutils.HandleCORS(w, r)
	if r.Method != http.MethodPost {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}
	requstruct, _ := sharedutils.RequestOperation[vipmodels.VIP](w, r)
	// 调用插入函数
	_, err := c.vipService.Registervip(r.Context(), requstruct)
	if err != nil {
		http.Error(w, "插入数据失败", http.StatusInternalServerError)
		return
	}
}

// 处理删除会员信息的请求
func (c *VipController) DeleteVIPHandler(w http.ResponseWriter, r *http.Request) {
	sharedutils.HandleCORS(w, r)
	if r.Method != http.MethodDelete {
		http.Error(w, "不支持的方法", http.StatusMethodNotAllowed)
		return
	}

	// 从请求中获取 VIPID
	vipPhone := r.URL.Query().Get("vipphone")
	if vipPhone == "" {
		http.Error(w, "缺少 VIPPHONE", http.StatusBadRequest)
		return
	}

	// 调用删除函数
	rowsAffected, err := c.vipService.DeleteVIP(r.Context(), vipPhone)
	fmt.Println("注销会员电话", vipPhone)
	fmt.Println("受影响的行数", rowsAffected)
	if err != nil {
		http.Error(w, "删除数据失败", http.StatusInternalServerError)
		return
	}

	if rowsAffected == 0 {
		http.Error(w, "未找到要删除的记录", http.StatusNotFound)
		return
	}

}
