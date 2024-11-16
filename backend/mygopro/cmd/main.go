package main

import (
	"fmt"
	"log"

	paymentcontrol "mygopro/internal/payment/controller"
	paymentrepo "mygopro/internal/payment/repositories"
	paymentserv "mygopro/internal/payment/services"
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

	http.HandleFunc("/api/declaration", sharedutils.TableDataInsertHandler)             //申请表填写以及提交
	http.HandleFunc("/api/gettableinfo", storagectrol.TableInfoHandler)                 //获取表的全部数据
	http.HandleFunc("/api/storage/cgoperation", storagectrol.CGOperationHandler)        //申报表操作
	http.HandleFunc("/api/storage/outoperation", storagectrol.OutOperationHandler)      //出库表操作
	http.HandleFunc("/api/storage/operationinfo", storagectrol.GetOperationInfoHandler) //库存审核操作数据获取
	http.HandleFunc("/api/storage/inventorychange", storagectrol.UpdateKucunNumHandler) //库存数量更新操作

	payrepo := paymentrepo.NewPaymentRepository(db)
	payserv := paymentserv.NewPaymentService(payrepo)
	paycontrol := paymentcontrol.NewPaymentController(payserv)
	http.HandleFunc("/api/tableinfoinsert", paycontrol.ProductdatainsertHandler)
	http.HandleFunc("/api/tableinfodelete", paycontrol.PaymentDeleteHandler)
	http.HandleFunc("/api/gettablecount", paycontrol.GetTableCountHandler)
	http.HandleFunc("/api/updateproductinfo", paycontrol.UpdateProductInfHandler) //更新表的数据
	http.HandleFunc("/api/arrayinsert", paycontrol.ProductdatainsertHandler2)
	http.HandleFunc("/api/discountitemsinfo", paycontrol.DiscountItemsInfoHandler) //优惠商品匹配
	fmt.Println("服务器正在运行")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
