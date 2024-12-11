export default function SiderNav() {
  return (
      <div className="flex-shrink-0 p-3 bg-white" style={{ width: '280px' }}>
          <a href="/" className="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
              <span className="fs-5 fw-semibold">顶呱呱</span>
          </a>
          <ul className="list-unstyled ps-0">
              {/* 首页 - 一级目录 */}
              <li className="mb-1">
                  <a href="/admin" className="nav-link text-decoration-none">首页</a>
              </li>

              {/* 会员管理 - 一级目录 */}
              <li className="mb-1">
                  <button className="btn btn-toggle align-items-center rounded collapsed" 
                          data-bs-toggle="collapse" 
                          data-bs-target="#vip-collapse" 
                          aria-expanded="false">
                      会员管理
                  </button>
                  <div className="collapse" id="vip-collapse">
                      <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                          <li><a href="/vip/info" className="link-dark rounded text-decoration-none">会员信息</a></li>
                          <li><a href="/vip/points" className="link-dark rounded text-decoration-none">会员积分</a></li>
                      </ul>
                  </div>
              </li>
              <li className="mb-1">
                 <button className="btn btn-toggle align-items-center rounded collapsed" 
                          data-bs-toggle="collapse" 
                          data-bs-target="#product-collapse" 
                          aria-expanded="false">
                      商品管理
                  </button>
                  <div className="collapse" id="product-collapse">
                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                        <li><a href="/storage/productlist" className="link-dark rounded text-decoration-none">商品列表</a></li>
                    </ul>
                  </div>
                  <div className="collapse" id="product-collapse">
                    <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                        <li><a href="/storage/categorylist" className="link-dark rounded text-decoration-none">商品类型列表</a></li>
                    </ul>
                  </div>
                  
              </li>

              {/* 库存管理 - 一级目录 */}
              <li className="mb-1">
                  <button className="btn btn-toggle align-items-center rounded collapsed" 
                          data-bs-toggle="collapse" 
                          data-bs-target="#storage-collapse" 
                          aria-expanded="false">
                      库存管理
                  </button>
                  <div className="collapse" id="storage-collapse">
                        <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li><a href="/storage/inventorylist" className="link-dark rounded text-decoration-none">库存列表</a></li>
                        </ul>
                  </div>
                  <div className="collapse" id="storage-collapse">
                      <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                          <li>
                              <button className="btn btn-toggle align-items-center rounded collapsed" 
                                      data-bs-toggle="collapse" 
                                      data-bs-target="#purchase-collapse" 
                                      aria-expanded="false">
                                  采购
                              </button>
                              <div className="collapse" id="purchase-collapse">
                                  <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                      <li><a href="/storage/cginfo" className="link-dark rounded text-decoration-none">采购信息</a></li>
                                      <li><a href="/storage/cgsb" className="link-dark rounded text-decoration-none">采购申请</a></li>
                                      <li><a href="/storage/cgoperation" className="link-dark rounded text-decoration-none">采购操作</a></li>
                                  </ul>
                              </div>
                          </li>
                          <li>
                              <button className="btn btn-toggle align-items-center rounded collapsed" 
                                      data-bs-toggle="collapse" 
                                      data-bs-target="#outbound-collapse" 
                                      aria-expanded="false">
                                  出库
                              </button>
                              <div className="collapse" id="outbound-collapse">
                                  <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                      <li><a href="/storage/ckinfo" className="link-dark rounded text-decoration-none">出库信息</a></li>
                                      <li><a href="/storage/cksb" className="link-dark rounded text-decoration-none">出库申请</a></li>
                                      <li><a href="/storage/ckoperation" className="link-dark rounded text-decoration-none">出库操作</a></li>
                                  </ul>
                              </div>
                          </li>
                      </ul>
                  </div>
              </li>

              {/* 收银管理 - 一级目录 */}
              <li className="mb-1">
                  <button className="btn btn-toggle align-items-center rounded collapsed" 
                          data-bs-toggle="collapse" 
                          data-bs-target="#cash-collapse" 
                          aria-expanded="false">
                      收银管理
                  </button>
                  <div className="collapse" id="cash-collapse">
                      <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                          {/* 可以在这里添加收银管理的子菜单 */}
                      </ul>
                  </div>
              </li>
          </ul>
      </div>
  )
}