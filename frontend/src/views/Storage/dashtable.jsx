import React from "react";


export function ProcurementInfo({ Results }) {
    return (
        <div className="container mt-4">
            <h3 className="mb-4">采购信息</h3>
            <form>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label>采购员工ID:</label>
                        <div className="form-control">{Results.purchaserStaffID}</div>
                    </div>
                    <div className="col-md-6">
                        <label>采购员工姓名:</label>
                        <div className="form-control">{Results.purchaserStaffName}</div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label>商品条码:</label>
                        <div className="form-control">{Results.barcode}</div>
                    </div>
                    <div className="col-md-6">
                        <label>商品类别:</label>
                        <div className="form-control">{Results.cGProCategory}</div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label>商品名称:</label>
                        <div className="form-control">{Results.cGProductName}</div>
                    </div>
                    <div className="col-md-6">
                        <label>成本价:</label>
                        <div className="form-control">{Results.cGCostPrice}</div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label>数量:</label>
                        <div className="form-control">{Results.cGQuantity}</div>
                    </div>
                    <div className="col-md-6">
                        <label>单位:</label>
                        <div className="form-control">{Results.cGProductUnit}</div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label>生产公司:</label>
                        <div className="form-control">{Results.productionCompany}</div>
                    </div>
                    <div className="col-md-6">
                        <label>生产地点:</label>
                        <div className="form-control">{Results.productAddress}</div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label>产品描述:</label>
                        <div className="form-control">{Results.productDescription}</div>
                    </div>
                    <div className="col-md-6">
                        <label>选择该商品的理由:</label>
                        <div className="form-control">{Results.selectReason}</div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label>供应商名称:</label>
                        <div className="form-control">{Results.supplierName}</div>
                    </div>
                    <div className="col-md-6">
                        <label>供应商ID:</label>
                        <div className="form-control">{Results.supplierID}</div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label>供应商地址:</label>
                        <div className="form-control">{Results.supplierAddress}</div>
                    </div>
                    <div className="col-md-6">
                        <label>供应商直接联系人:</label>
                        <div className="form-control">{Results.supplierContactName}</div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label>供应商直接联系人电话号码:</label>
                        <div className="form-control">{Results.supplierContactPhone}</div>
                    </div>
                    <div className="col-md-6">
                        <label>供应商备用联系号码:</label>
                        <div className="form-control">{Results.supplierContactStandby}</div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label>供应商公司邮件:</label>
                        <div className="form-control">{Results.supplierEmail}</div>
                    </div>
                </div>
            </form>
        </div>
    );
}


export function OutDeclarationInfo({ Results }) {
    return (
        <div className="container mt-4">
            <h2 className="mb-4">出库单信息</h2>
            <div className="row mb-3">
                <div className="col-md-6">
                    <label>申请表ID:</label>
                    <div className="form-control">{Results.recordID}</div>
                </div>
                <div className="col-md-6">
                    <label>出库单状态:</label>
                    <div className="form-control">{Results.outboundState}</div>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <label>申请人姓名:</label>
                    <div className="form-control">{Results.applyStaffName}</div>
                </div>
                <div className="col-md-6">
                    <label>申请人ID:</label>
                    <div className="form-control">{Results.applyStaffID}</div>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <label>条形码:</label>
                    <div className="form-control">{Results.barcode}</div>
                </div>
                <div className="col-md-6">
                    <label>出库产品名称:</label>
                    <div className="form-control">{Results.outProductName}</div>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <label>出库数量:</label>
                    <div className="form-control">{Results.outQuantity}</div>
                </div>
                <div className="col-md-6">
                    <label>出库单位:</label>
                    <div className="form-control">{Results.outProductUnit}</div>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-12">
                    <label>出库原因:</label>
                    <div className="form-control">{Results.outReason}</div>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-12">
                    <label>申请日期:</label>
                    <div className="form-control">{Results.applyDate}</div>
                </div>
            </div>
        </div>
    );
}

export function CheckData({Results}){
    return(
        <div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <label>审核人员id:</label>
                    <div className="form-control">{Results.checkStaffID}</div>
                </div>
                <div className="col-md-6">
                    <label>审核人员姓名:</label>
                    <div className="form-control">{Results.checkStaffName}</div>
                </div>
                <div className="col-md-6">
                    <label>审核结果:</label>
                    <div className="form-control">{Results.checkResult}</div>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <label>审核意见:</label>
                    <div className="form-control">{Results.checkOpinion}</div>
                </div>
                <div className="col-md-6">
                    <label>审核时间:</label>
                    <div className="form-control">{Results.checkDate}</div>
                </div>
            </div>
         </div>
    );
}

export  function PutinData({Results}){
    return(
        <div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <label>入库人员id:</label>
                    <div className="form-control">{Results.storehouseStaffID}</div>
                </div>
                <div className="col-md-6">
                    <label>入库人员姓名:</label>
                    <div className="form-control">{Results.storehouseStaffName}</div>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <label>入库结果:</label>
                    <div className="form-control">{Results.putInResult}</div>
                </div>
                <div className="col-md-6">
                    <label>入库数量:</label>
                    <div className="form-control">{Results.putInQuantities}</div>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <label>入库备注:</label>
                    <div className="form-control">{Results.putInOpinion}</div>
                </div>
                <div className="col-md-6">
                    <label>入库时间:</label>
                    <div className="form-control">{Results.putInDate}</div>
                </div>
            </div>
        </div>
    )
}


export function ExamineData({Results}){
return(
        <div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <label>仓库工作人员ID:</label>
                    <div className="form-control">{Results.StaffID}</div>
                </div>
                <div className="col-md-6">
                    <label>仓库工作人员姓名:</label>
                    <div className="form-control">{Results.StaffName}</div>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <label>仓库执行结果:</label>
                    <div className="form-control">{Results.Result}</div>
                </div>
                <div className="col-md-6">
                    <label>仓库操作意见:</label>
                    <div className="form-control">{Results.Opinion}</div>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <label>仓库执行商品数量:</label>
                    <div className="form-control">{Results.Quantities}</div>
                </div>
                <div className="col-md-6">
                    <label>执行时间:</label>
                    <div className="form-control">{Results.Date}</div>
                </div>
            </div>
        </div>
    )
}



//product 
export function ProductDetailInfo({Result}){
    return(
        <div className="container">
                <div className="col-md-6">
                    <label>商品ID:</label>
                    <div className="form-control">{Result.ProductID}</div>
                </div>
                <div className="col-md-6">
                    <label>商品名称:</label>
                    <div className="form-control">{Result.ProductName}</div>
                </div>
                <div className="col-md-6">
                    <label>商品图片:</label>
                    <div className="form-control"> <img
                    src={`http://localhost:3001/${Result.ImagePath}`}
                    alt="展示图片"
                    style={{ width: '100%', height: 'auto' }}
                />
                </div>
                </div>
                <div className="col-md-6">
                    <label>商品条码:</label>
                    <div className="form-control">{Result.ProBarcode}</div>
                </div>
                <div className="col-md-6">
                    <label>商品种类:</label>
                    <div className="form-control">{Result.Category}</div>
                </div>
                <div className="col-md-6">
                    <label>商品成本价:</label>
                    <div className="form-control">{Result.CostPrice}</div>
                </div>
                <div className="col-md-6">
                    <label>商品零售价:</label>
                    <div className="form-control">{Result.RetailPrice}</div>
                </div>
                <div className="col-md-6">
                    <label>商品详情:</label>
                    <div className="form-control">{Result.DetailedlyDesc}</div>
                </div>
                <div className="col-md-6">
                    <label>商品货架位置:</label>
                    <div className="form-control">{Result.ProLocation}</div>
                </div>
            </div>
    )
}

//category
export function CategoryInfo({Results}) {
    return (
        <div>
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <label>类型编号:</label>
                    <div className="form-control">{Results.CategoryID}</div>
                </div>
                <div className="col-md-3"></div>
            </div>
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <label>类型名称:</label>
                    <div className="form-control">{Results.CategoryName}</div>
                </div>
                <div className="col-md-3"></div>

            </div>
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <label>类型详情:</label>
                    <div className="form-control">{Results.CategoryDesc}</div>
                </div>
                <div className="col-md-3"></div>

            </div>
        </div>
    )
}

//inventory
export function InventoryInfo({Result}) {   
    
    console.log("InventoryInfo",Result)

    return (
        <div className="container">
              <div className="row">
                <div className="col-md-6">
                    <label>商品ID:</label>
                    <div className="form-control">{Result.Inventory_id}</div>
                </div>
                <div className="col-md-6">
                    <label>商品名称:</label>
                    <div className="form-control">{Result.Inv_productname}</div>
                </div>
            </div>
            <div className="eow">
                    <label>商品图片:</label>
                    <div className="form-control"> 
                    <img
                    src={`http://localhost:3001/${Result.ImagePath}`}
                    alt="展示图片（已下架商品无商品图片）"
                    style={{ width: '100%', height: '360px' }}
                />
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <label>商品条码:</label>
                    <div className="form-control">{Result.Inv_barcode }</div>
                </div>
                <div className="col-md-6">
                    <label>商品种类:</label>
                    <div className="form-control">{Result.Category}</div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <label>商品数量单位:</label>
                    <div className="form-control">{Result.Inv_unit}</div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <label>库存总数量:</label>
                    <div className="form-control">{Result.Stockall_quantity}</div>
                </div>
                <div className="col-md-6">
                    <label>库存现有数量:</label>
                    <div className="form-control">{Result.Stocknow_quantity}</div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <label>库存出库数量:</label>
                    <div className="form-control">{Result.Stockout_quantity}</div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <label>商品库存最小数量:</label>
                    <div className="form-control">{Result.Stock_minquantity}</div>
                </div>
                <div className="col-md-6">
                    <label>商品库存状态:</label>
                    <div className="form-control">{Result.Inv_status}</div>
                </div>
            </div>
        </div>
    )
}