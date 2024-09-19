
import { INVENTORYKEY, OUTAPPLYKEY, OUTCHECKREKEY, OUTPRODUCTSKEY, OUTRECORDKEY } from "../../Mock/inventoryMock";
import useSession from "../../useSession";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getLocalStorage, AddnewValue } from "../../utils/storageways";
import { RealTimeClock } from "../../Components/groceries";

// 给出库申报表进行审核 这是顶级boss干的事  接下来的数据应该放在记录表中
export function ProductOutCheck() {
    const [checkResult, setCheckResult] = useState(null);
    const [Checkopinion, setCheckOpinion] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const { outrecordid } = useParams();
    const iniotproduct = getLocalStorage(OUTAPPLYKEY, true) || [];
    const { getSession } = useSession();
    const checker = getSession();

//    申请表对应商品的出库申报表
    const product = iniotproduct.find(item => item.OutRecordID === outrecordid);

    const handleChange = (event) => {
        setCheckResult(event.target.value);
    }
    const handleOpinionChange = (event) => {
        setCheckOpinion(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    
        let resultData;
    
        console.log("checkResult:", checkResult);
        console.log("product:", product);
    
        if (checkResult && product) { 
            resultData = {
                OBReRecordID:product.OutRecordID,
                ApplyStaffID:product.ApplyStaffID,
                ApplyStaffName :product.ApplyStaffName,
                OBReProductID :product.OutProductID ,
                OBReProductName :product.OutProductName,
                OBReProductBarcode :product. OutProductBarcode,                
                OBReApplyQuantityUnit :product.OutboundQuantity,
                OBReApplyTime :product.OutboundQuantity,
                CheckStaffID:checker.EmployeeID,
                CheckResult:checkResult,
                CheckOpinion:Checkopinion,
                CheckDate:currentTime,
            };
    
            console.log("resultData:", resultData);   
            AddnewValue(resultData, OUTRECORDKEY);
        } else {
            console.warn("checkResult or product is invalid."); // 提示 checkResult 或 product 无效
        }
    };
    
        
        let productDetail = <div>未找到该出库记录。</div>; // 默认值
        if (product) {
            productDetail = (
                <div>
                    商品出库申报信息:<br />
                    <strong>记录ID</strong>{product.OutRecordID}
                    <strong>申报人ID</strong>{product.ApplyStaffID} <br />
                    <strong>申报人姓名</strong>{product.ApplyStaffName} <br />
                    <strong>商品名称:</strong> {product.productName} <br />
                    <strong>商品条码:</strong> {product.OutProductBarcode} <br />
                    <strong>出库原因：</strong>{product.OutBoundReason} <br />
                    <strong>出库数量：</strong>{product.OutboundQuantity} <br />
                    <strong>数量单位：</strong>{product. OutboundQuantityt} <br />      
                    <strong>申报时间:</strong>{product.OutApplyTime} <br />
                    <hr />
                </div>
            );
        }

        return (
            <div>
                 <div>
                   {productDetail}
                 </div>
                 <form onSubmit={handleSubmit}>
                    申报是否通过:<br />
                    <input type="radio" value="yes" checked={checkResult === 'yes'} onChange={handleChange} /> 是
                    <input type="radio" value="no" checked={checkResult === 'no'} onChange={handleChange} /> 否<br />
                     {checkResult && (
                        <div>
                            审批意见：<input type="text" value={Checkopinion} onChange={handleOpinionChange} />                         </div>
                    )}
                    <br />
                 审核时间:<RealTimeClock setCurrentTime={setCurrentTime} />
                    <input type="submit" value="提交" />
                 </form>
            </div>
        );
    }
