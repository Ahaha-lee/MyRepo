package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/api/vip", VipHandler)                     //查询
	http.HandleFunc("/api/vip/add", UpdateVIPHandler)           //增加会员积分
	http.HandleFunc("/api/vip/delete", UpdateVIPHandler)        //删除会员积分
	http.HandleFunc("/api/vip/registervip", RegisterVipHandler) //新会员注册
	http.HandleFunc("/api/vip/deletevip", DeleteVIPHandler)     //删除会员

	fmt.Println("服务器正在运行")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
