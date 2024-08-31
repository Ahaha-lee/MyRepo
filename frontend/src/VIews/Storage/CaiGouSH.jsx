import { useState } from "react";
import { AddnewValue, getLocalStorage } from "../../utils/storageways";
import { CHECKRESULTKEY,CGNOTEXISTEDKEY,CGEXISTEDKEY } from "../../Mock/inventoryMock";
import { RealTimeClock } from "../../Components/groceries";
import { Link, useParams } from "react-router-dom";
import useSession from "../../useSession";
import { FaBarcode } from "react-icons/fa";

export function CheckForCaiGou() {
    const [checkResult, setCheckResult] = useState(null);
    const [approvalopinion, setApprovalOpinion] = useState("");
    const [currentTime, setCurrentTime] = useState(""); // 新增状态来存储当前时间
    const { recordid } = useParams();
    const iniExisted = getLocalStorage(CGEXISTEDKEY, true) || [];
    const iniNotExisted = getLocalStorage(CGNOTEXISTEDKEY, true) || [];
    const { getSession } = useSession();
    const checker = getSession();
    
    // 根据 recordid 查找对应的商品
    const productE = iniExisted.find(item => item.recordid === recordid);
    const productNE = iniNotExisted.find(item => item.recordid === recordid);
    const applystaffId = productE ? productE.purchaserId : productNE ? productNE.purchaserId : null;
    const productname = productE ? productE.productName : productNE ? productNE.productName : null;
    const barcode = productE ? productE.barcode : productNE ? productNE.barcode: null;

    const handleChange = (event) => {
        setCheckResult(event.target.value);
    };

    const handleOpinionChange = (event) => {
        setApprovalOpinion(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        let resultData;

        if (checkResult) {
            resultData = {
                recordid,
                productname,
                barcode,
                checkResult,
                applystaffId,
                checkId: checker.staffId,
                approvalopinion: approvalopinion,
                checkTime: currentTime, // 将当前时间添加到结果数据中
            };
        }

        AddnewValue(resultData, CHECKRESULTKEY);
    };

    let productDetail;

    if (productE) {
        productDetail = (
            <div>
                已存在商品采购:<br/>
                <strong>商品名称:</strong> {productE.productName} <br />
                <strong>商品记录ID:</strong> {productE.recordid} <br /> 
                <strong>商品ID:</strong> {productE.productId} <br />
                <strong>商品条码:</strong> {productE.barcode} <br />
                <strong>商品类型:</strong> {productE.productType} <br />
                <strong>数量:</strong> {productE.productQuantity} <br/>
                <strong>数量单位：</strong>{productE.productUnit} <br />
                <strong>价格:</strong> ¥{productE.productPrice} <br />
                <strong>描述:</strong> {productE.productDescription} <br />
                <strong>生产公司:</strong> {productE.productionCompany} <br />
                <strong>选择理由:</strong> {productE.reasonForSelection} <br />
                <strong>采购人:</strong> {productE.purchaserName} <br />
                <strong>采购人编号：</strong>{productE.purchaserId}<br/>
                <strong>供应商:</strong> {productE.supplierName} <br />
                <hr />
            </div>
        );
    } else if (productNE) {
        productDetail = (
            <div>
                未存在商品采购:<br/>
                <strong>商品名称:</strong> {productNE.productName} <br />
                <strong>商品记录ID:</strong> {productNE.recordid} <br /> 
                <strong>商品条码:</strong> {productNE.barcode} <br />
                <strong>商品类型:</strong> {productNE.productType} <br />
                <strong>数量:</strong> {productNE.productQuantity} <br />
                <strong>数量单位：</strong>{productNE.productUnit} <br />
                <strong>价格:</strong> ¥{productNE.productPrice} <br />
                <strong>描述:</strong> {productNE.productDescription} <br />
                <strong>生产公司:</strong> {productNE.productionCompany} <br />
                <strong>选择理由:</strong> {productNE.reasonForSelection} <br />
                <strong>采购人:</strong> {productNE.purchaserName} <br />
                <strong>采购人编号:</strong> {productNE.purchaserId} <br />
                <strong>供应商:</strong> {productNE.supplierName} <br />
                <strong>供应商联系方式:</strong> {productNE.supplierContact} <br />
                <strong>供应商地址:</strong> {productNE.supplierAddress} <br />
                <strong>供应商联系人:</strong> {productNE.supplierContactName} <br />
                <strong>供应商联系电话:</strong> {productNE.supplierContactPhone} <br />
                <hr />
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
