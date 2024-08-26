import { useState, useEffect } from "react";
import { getLocalStorage, setLocalStorage } from "../../utils/storageways";
import { AGREECAiGOUSB, AGREECGSBKEY, CAIGOUSBKEY } from "../../Mock/inventoryMock";
import { RealTimeClock } from "../../Components/groceries";

export function CheckForCaiGou() {
    const [checkResult, setCheckResult] = useState(null);
    const [agreeData, setAgreeData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); 
    // const nowtime = RealTimeClock();
    // const formattedDate = nowtime.toISOString().slice(0, 19);
    const [reason, setReason] = useState("");
    const [remarks, setRemarks] = useState(""); 

    useEffect(() => {
        const initialAgreeData = getLocalStorage(CAIGOUSBKEY, true);
        setAgreeData(initialAgreeData);
    }, []); 

    const handleChange = (event) => {
        setCheckResult(event.target.value);
    };

    const handleReasonChange = (event) => {
        setReason(event.target.value);
    };

    const handleRemarksChange = (event) => {
        setRemarks(event.target.value);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % agreeData.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + agreeData.length) % agreeData.length);
    };

    const currentProduct = agreeData[currentIndex];
    console.log(currentProduct);

    return (
        <div>
            审核产品
            {currentProduct ? ( 
                <div>
                    <p>{currentProduct.productName}</p>
                    <p>描述: {currentProduct.productDescription}</p>
                    <p>价格: {currentProduct.productPrice}</p>
                    <p>数量: {currentProduct.productQuantity}</p>
                    <p>类型: {currentProduct.productType}</p>
                    <p>生产公司: {currentProduct.productionCompany}</p>
                    <p>采购人: {currentProduct.purchaserName}</p>
                    <p>选择理由: {currentProduct.reasonForSelection}</p>
                </div>
            ) : (
                <p>没有可显示的产品信息。</p>
            )}
            <button onClick={handlePrevious} disabled={currentIndex === 0}>上一个</button>
            <button onClick={handleNext} disabled={currentIndex === agreeData.length - 1}>下一个</button>

            <form >
                申报是否通过
                <input type="radio" value="yes" checked={checkResult === 'yes'} onChange={handleChange}/> 是
                <input type="radio" value="no" checked={checkResult === 'no'} onChange={handleChange}/> 否<br/>

                {checkResult === 'no' && (
                    <div>
                        审核不通过理由：<input type="text" value={reason} onChange={handleReasonChange} />
                    </div>
                )}

                {checkResult === 'yes' && (
                    <div>
                        备注（注意事项）：<input type="text" value={remarks} onChange={handleRemarksChange} />
                    </div>
                )}
                <br />
                {/* {formattedDate} */}
                <RealTimeClock />
                <input type="submit" value="提交"/>
            </form>
        </div>
    );
}
