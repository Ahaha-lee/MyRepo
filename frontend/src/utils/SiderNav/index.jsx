
import { Link, useNavigate } from "react-router-dom"
export default function SiderNav() {
  const navigate = useNavigate();
  return (
    <div className="flex-shrink-0 p-3 bg-white" style={{ width: '280px' }}>
    <a href="/" className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
        <span className="fs-5 fw-semibold text-start">顶呱呱</span>
    </a>
    <ul className="list-unstyled ps-0">
        {/* 首页 - 一级目录 */}
        <li className="mb-1">
            <button className="btn btn-toggle align-items-center rounded collapsed text-start" 
                    onClick={() => navigate("/admin")}>
                首页
            </button>
        </li>

        {/* 会员管理 - 一级目录 */}
        <li className="mb-1">
            <button className="btn btn-toggle align-items-center rounded collapsed text-start" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#vip-collapse" 
                    aria-expanded="false">
                会员管理
            </button>
            <div className="collapse" id="vip-collapse">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    {/* <li className="text-secondary">
                        <a href="/vip/summarize" className="link-dark rounded text-decoration-none text-start">会员概览</a>
                    </li> */}
                    <li className="text-secondary">
                        <a href="/vip/info" className="link-dark rounded text-decoration-none text-start">会员信息</a>
                    </li>
                    <li className="text-secondary">
                        <a href="/vip/points" className="link-dark rounded text-decoration-none text-start">会员积分</a>
                    </li>
                    <li className="text-secondary">
                        <a href="/vip/setgrade" className="link-dark rounded text-decoration-none text-start">会员等级</a>
                    </li>
                </ul>
            </div>
        </li>

        {/* 商品管理 - 一级目录 */}
        <li className="mb-1">
            <button className="btn btn-toggle align-items-center rounded collapsed text-start" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#product-collapse" 
                    aria-expanded="false">
                商品管理
            </button>
            <div className="collapse" id="product-collapse">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li className="text-secondary">
                        <a href="/storage/productlist" className="link-dark rounded text-decoration-none text-start">商品列表</a>
                    </li>
                    <li className="text-secondary">
                        <a href="/storage/categorylist" className="link-dark rounded text-decoration-none text-start">商品类型列表</a>
                    </li>
                </ul>
            </div>
        </li>

        {/* 库存管理 - 一级目录 */}
        <li className="mb-1">
            <button className="btn btn-toggle align-items-center rounded collapsed text-start" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#storage-collapse" 
                    aria-expanded="false">
                库存管理
            </button>
            <div className="collapse" id="storage-collapse">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li className="text-secondary">
                        <a href="/storage/inventorylist" className="link-dark rounded text-decoration-none text-start">库存列表</a>
                    </li>
                    {/* 货流 */}
                    <li>
                        <button className="btn btn-toggle align-items-center rounded collapsed text-start" 
                                data-bs-toggle="collapse" 
                                data-bs-target="#suppliers-collapse" 
                                aria-expanded="false">
                            货流
                        </button>
                        <div className="collapse" id="suppliers-collapse">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                <li>
                                    <button className="btn btn-toggle align-items-center rounded collapsed text-start" 
                                            data-bs-toggle="collapse" 
                                            data-bs-target="#purchase-collapse" 
                                            aria-expanded="false">
                                        入库（采购）
                                    </button>
                                    <div className="collapse" id="purchase-collapse">
                                        <ul className="list-unstyled">
                                            <li className="text-secondary">
                                                <a href="/storage/cginfo" className="link-dark rounded text-decoration-none text-start">采购信息</a>
                                            </li>
                                            <li className="text-secondary">
                                                <a href="/storage/cgsb" className="link-dark rounded text-decoration-none text-start">采购申请</a>
                                            </li>
                                            <li className="text-secondary">
                                                <a href="/storage/cgoperation" className="link-dark rounded text-decoration-none text-start">采购操作</a>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li>    
                                    <button className="btn btn-toggle align-items-center rounded collapsed text-start" 
                                            data-bs-toggle="collapse" 
                                            data-bs-target="#outbound-collapse" 
                                            aria-expanded="false">
                                        出库
                                    </button>
                                    <div className="collapse" id="outbound-collapse">
                                        <ul className="list-unstyled">
                                            <li className="text-secondary">
                                                <a href="/storage/ckinfo" className="link-dark rounded text-decoration-none text-start">出库信息</a>
                                            </li>
                                            <li className="text-secondary">
                                                <a href="/storage/cksb" className="link-dark rounded text-decoration-none text-start">出库申请</a>
                                            </li>
                                            <li className="text-secondary">
                                                <a href="/storage/ckoperation" className="link-dark rounded text-decoration-none text-start">出库操作</a>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                    {/* 库存商品管理 */}
                    <li>
                    {/* <button className="btn btn-toggle align-items-center rounded collapsed text-start" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#inventory-collapse" 
                            aria-expanded="false">
                        库存商品管理
                    </button> */}
                    <div className="collapse" id="inventory-collapse">
                        {/* <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li className="text-secondary">
                                <a href="/storage/inventory-plan" className="link-dark rounded text-decoration-none text-start">盘点计划</a>
                            </li>
                            <li className="text-secondary">
                                <a href="/storage/inventory-history" className="link-dark rounded text-decoration-none text-start">盘点历史</a>
                            </li>
                            <li className="text-secondary">
                                <a href="/storage/product-damage" className="link-dark rounded text-decoration-none text-start">商品报损</a>
                            </li>
                            <li className="text-secondary">
                                <a href="/storage/shelf-life" className="link-dark rounded text-decoration-none text-start">保质期</a>
                            </li>
                            <li className="text-secondary">
                                <a href="/storage/limits" className="link-dark rounded text-decoration-none text-start">上下限调整</a>
                            </li>
                        </ul> */}
                    </div>
                    </li>
                </ul>
            </div>
        </li>
        {/* 收银管理 - 一级目录 */}
        <li className="mb-1">
            <button className="btn btn-toggle align-items-center rounded collapsed text-start" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#cash-collapse" 
                    aria-expanded="false">
                收银管理
            </button>
            <div className="collapse" id="cash-collapse">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                <li className="text-secondary">
                        <a href="/payment/cash" className="link-dark rounded text-decoration-none text-start">收银员主页面</a>
                    </li>
                    {/* <li className="text-secondary">
                        <a href="/cash/overview" className="link-dark rounded text-decoration-none text-start">收银概览</a>
                    </li> */}
                    {/* <li className="text-secondary">
                        <a href="/cash/reports" className="link-dark rounded text-decoration-none text-start">收银报表</a>
                    </li> */}
                    <li className="text-secondary">
                        <a href="/payment/discount" className="link-dark rounded text-decoration-none text-start">商品优惠管理</a>
                    </li>
                    <li className="text-secondary">
                        <a href="/payment/discount/type" className="link-dark rounded text-decoration-none text-start">商品优惠类型</a>
                    </li>
                    </ul>
                </div>
            </li>
             {/* 系统管理 - 一级目录 */}
        <li className="mb-1">
            <button
                className="btn btn-toggle align-items-center rounded collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#system-collapse"
                aria-expanded="false"
            >系统管理</button>
            <div className="collapse" id="system-collapse">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li className="text-secondary">
                        <a href="/sysmanage/permissions_setting" className="link-dark rounded text-decoration-none text-start">权限分配</a>
                    </li>
                   
                </ul>
            </div>
        </li>
        </ul>
    </div>


  )
}