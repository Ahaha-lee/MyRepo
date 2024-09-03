import { useParams } from "react-router-dom";
import { CGEXISTEDKEY, CGNOTEXISTEDKEY, CHECKRESULTKEY } from "../../Mock/inventoryMock";
import { getLocalStorage, setLocalStorage } from "../../utils/storageways";
import { useState } from "react";
import { RealTimeClock } from "../../Components/groceries";

export function CaiGouReceive() {
    const inicheckresult = getLocalStorage(CHECKRESULTKEY, true);
    const iniExisted = getLocalStorage(CGEXISTEDKEY,true);
    const iniNotExisted = getLocalStorage(CGNOTEXISTEDKEY,true);
    const { recordid } = useParams();
    const productE = iniExisted.find(item => item.recordid === recordid);
    const productNE = iniNotExisted.find(item => item.recordid === recordid);
    const tempt = productE?productE.productQuantity :productNE.productQuantity;
    const [putinQuantities, setPutinQuantities] = useState(tempt); // 入库数量
    const [currentTime, setCurrentTime] = useState(""); // 入库时间
    const [putinResult, setPutinResult] = useState(null);

    let record = null; 
    if(inicheckresult.length>0){
    // 查找匹配的记录
    for (let i = 0; i < inicheckresult.length; i++) {
        if (inicheckresult[i].recordid === recordid) {
            record = inicheckresult[i];
            break; 
        }
    }
    }

    if(!record || record?.checkResult==='no')
    {
        return(
            <div>
                该记录不可入库(请确认是否通过审核)
            </div>
        );
    }

    const handleChange = (event) => {
        setPutinResult(event.target.value);
    };

    const handleQuantitiesChange = (event) => {
        setPutinQuantities(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const resultData = {
            ...record,
            putinResult,
            putinQuantities,
            putinTime: currentTime,
        };
        const updatedCheckResults = inicheckresult.map(item =>
            item.recordid === recordid ? resultData : item
        );
        setLocalStorage(CHECKRESULTKEY, updatedCheckResults, true); // 整个数组的更新
    };

    return (
        <div>
            <div>
                申报记录编号：{record.recordid}<br />
                申报商品名称：{record.productname}<br />
                申报商品条码：{record.barcode}
            </div>
            <form onSubmit={handleSubmit}>
                <h3>是否完成入库:</h3>
                <input type="radio" value="yes" checked={putinResult === 'yes'} onChange={handleChange} /> 是
                <input type="radio" value="no" checked={putinResult === 'no'} onChange={handleChange} /> 否
                <br />
                {putinResult && (
                    <div>
                        入库数量：
                        <input  type="number" 
                                value={putinQuantities} 
                                onChange={handleQuantitiesChange}
                                placeholder="是否区别于申报表中的入库数量"/>
                    </div>
                )}
                <br />
                <RealTimeClock setCurrentTime={setCurrentTime} /> {/* 传递状态更新函数 */}
                <input type="submit" value="提交" />
            </form>
        </div>
    );
}
