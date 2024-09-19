import { useState } from "react";
import {setLocalStorage, getLocalStorage } from "../../utils/storageways";
import { INBOUNDRECORDKEY} from "../../Mock/inventoryMock";
import { RealTimeClock } from "../../Components/groceries";
import { Link, useParams } from "react-router-dom";
import useSession from "../../useSession";


//顶级boss账号下的，起到一个给提交上来的申报表进行审核的作用  
export  default function CheckForCaiGou() {
    const [checkResult, setCheckResult] = useState(null);
    const [approvalopinion, setApprovalOpinion] = useState("");
    const [currentTime, setCurrentTime] = useState(""); // 新增状态来存储当前时间
    const { recordid } = useParams();
    const inicaigourecord = getLocalStorage(INBOUNDRECORDKEY,true)//获取采购申报表
    const { getSession } = useSession();
    const checker = getSession();

    // 根据 recordid 在采购申报表数组中查找对应的商品
    const product = inicaigourecord.find(item => item.RecordID === recordid);
    const handleChange = (event) => {
        setCheckResult(event.target.value);
    };

    const handleOpinionChange = (event) => {
        setApprovalOpinion(event.target.value);
    };
    //审核结束以后无论审核是否通过） 想数据中的入库记录数组中 push新的记录数据
    const handleSubmit = (event) => {
        event.preventDefault();

        if (checkResult) {
            const resultData = {
               ...product,
               CheckStaffID:checker.EmployeeID,              
               CheckResult:checkResult,
               CheckOpinion: approvalopinion,
               CheckData: currentTime,
            };
            const updatedCheckResults = inicaigourecord.map(item =>
                item.RecordID === recordid ? resultData : item
            );
            setLocalStorage(INBOUNDRECORDKEY, updatedCheckResults, true); // 整个数组的更新
        }

    };

    let productDetail;

    if (product){
        productDetail = (
            <div>
                商品采购:<br/>
                <strong>标题:</strong> {product.Title} <br />
                <strong>采购记录ID:</strong> {product.RecordID} <br />
                <strong>采购员工ID:</strong> {product.PurchaserStaffID} <br />
                <strong>采购员工姓名:</strong> {product.PurchaserStaffName} <br />
                <strong>商品条码:</strong> {product.CGProductBarcode} <br />
                <strong>商品类别:</strong> {product.CGProCategory} <br />
                <strong>商品名称:</strong> {product.CGProductName} <br />
                <strong>成本价:</strong> {product.CGCostPrice} <br />
                <strong>数量:</strong> {product.CGQuantity} <br />
                <strong>单位:</strong> {product.CGProductUnit} <br />
                <strong>生产公司:</strong> {product.ProductionCompany} <br />
                <strong>生产地点:</strong> {product.ProductAddress} <br />
                <strong>产品描述:</strong> {product.ProductDescription} <br />
                <strong>选择该商品的理由:</strong> {product.SelectReason} <br />
                <strong>供应商名称:</strong> {product.SupplierName} <br />
                <strong>供应商ID:</strong> {product.SupplierID} <br />
                <strong>供应商地址:</strong> {product.SupplierAddress} <br />
                <strong>供应商直接联系人:</strong> {product.SupplierContactName} <br />
                <strong>供应商直接联系人电话号码:</strong> {product.SupplierContactPhone} <br />
                <strong>供应商备用联系号码:</strong> {product.SupplierContactStandby} <br />
                <strong>供应商公司邮件:</strong> {product.SupplierEmail} <br />
                <strong>申报表提交时间:</strong> {product.ApplyDate } <br />
                <hr/>
            </div>
        );
    } else {
        productDetail = <p>未找到对应的商品数据。</p>;
    }


    return (
        <>
            <div>
                {productDetail}
            </div>
            <form onSubmit={handleSubmit}>
                申报是否通过:<br/>
                <input type="radio" value="yes" checked={checkResult === 'yes'} onChange={handleChange}/> 是
                <input type="radio" value="no" checked={checkResult === 'no'} onChange={handleChange}/> 否<br/>
                {checkResult && (
                    <div>
                        审批意见：<input type="text" value={approvalopinion} onChange={handleOpinionChange} />
                    </div>
                )}
                <br />
                <RealTimeClock setCurrentTime={setCurrentTime} /> {/* 传递状态更新函数 */}
                <input type="submit" value="提交"/>
            </form>
            <Link to='/caigoulist'>返回上一页</Link>
        </>
    );
}
