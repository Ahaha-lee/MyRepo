package main

import (
	"fmt"
	"log"

	storctrol "mygopro/internal/storage/controllers"
	storrepo "mygopro/internal/storage/repositories"
	storserv "mygopro/internal/storage/service"
	viptrol "mygopro/internal/vip/controllers"
	viprepo "mygopro/internal/vip/repositories"
	vipserv "mygopro/internal/vip/service"
	sharedutils "mygopro/utils"

	"net/http"
)

func main() {
	db := sharedutils.DataBaseConnect()                                       // 1. 连接数据库
	vipRepository := viprepo.NewVipRepository(db)                             // 2. 创建 VipRepository 实例
	vipService := vipserv.NewVipService(vipRepository)                        // 3. 创建 VipService 实例
	vipController := viptrol.NewVipController(vipService)                     // 4. 创建 VipController 实例
	http.HandleFunc("/api/vip/search", vipController.GetVipHandler)           //查询函数
	http.HandleFunc("/api/vip/add", vipController.UpdateVIPHandler)           //增加会员积分
	http.HandleFunc("/api/vip/delete", vipController.UpdateVIPHandler)        //删除会员积分
	http.HandleFunc("/api/vip/registervip", vipController.RegisterVipHandler) //新会员注册
	http.HandleFunc("/api/vip/deletevip", vipController.DeleteVIPHandler)     //删除会员

	storagerepo := storrepo.NewStorageRepository(db)
	storageserv := storserv.NewStorageService(storagerepo)
	storagectrol := storctrol.NewStorageController(storageserv)
	http.HandleFunc("/api/storage/listdata", storagectrol.CaiGouListHandler)

	http.HandleFunc("/api/declaration", sharedutils.DeclarationHandler)            //申请表填写以及提交
	http.HandleFunc("/api/gettableinfo", storagectrol.TableInfoHandler)            //获取表的全部数据
	http.HandleFunc("/api/storage/cgoperation", storagectrol.CGOperationHandler)   //申报表操作
	http.HandleFunc("/api/storage/outoperation", storagectrol.OutOperationHandler) //出库表操作
	http.HandleFunc("/api/storage/operationinfo", storagectrol.GetOperationInfoHandler)

	// http.Handle("/api/storage/putindeclaration", http.HandlerFunc(handler.DeclarePutinHandler))     //申报商品入库
	// http.Handle("/api/storage/examinedeclaration", http.HandlerFunc(handler.DeclareExamineHandler)) //申报商品验收

	fmt.Println("服务器正在运行")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
