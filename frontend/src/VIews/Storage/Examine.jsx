import { useState } from "react";
import { CGNOTEXISTEDKEY, CHECKRESULTKEY, INVENTORYKEY } from "../../Mock/inventoryMock"; 
import { AddnewValue, getLocalStorage, setLocalStorage,GetLatestid } from "../../utils/storageways";
import { RealTimeClock } from "../../Components/groceries";
import { useParams } from "react-router-dom";
import { PRODUCTSKEY } from "../../Mock/productsMock";

export function CaiGouExamine() {
    const inicheckresult = getLocalStorage(CHECKRESULTKEY, true);
    const initialinventory = getLocalStorage(INVENTORYKEY, true);
    const iniNotExisted = getLocalStorage(CGNOTEXISTEDKEY,true);
    const { recordid } = useParams(); // URL获得recordid
    const [examineResult, setExamineResult] = useState('');
    const [acceptanceOpinion, setAcceptanceOpinion] = useState('');  
    const [currentTime, setCurrentTime] = useState(""); 

    
    
    const record = inicheckresult.find(item => item.recordid === recordid);
    const productNe = iniNotExisted.find(item=>item.barcode===record.barcode);
    const [quantities, setQuantities] = useState(record.putinQuantities);
    const invproduct = initialinventory.find(item => item.barcode === record.barcode)||'noExisted';
    if(record.checkResult==='no'||
        record.examineResult ==='no'
        ){
            return(
                <div>
                    不可验收（请确认是否通过审核或者入库）
                </div>
            );
        }
   
    const handleAcceptanceChange = (event) => {
        setAcceptanceOpinion(event.target.value);
    };

    const handleChange = (event) => {
        setExamineResult(event.target.value);
    };

    const handleQuantitiesChange = (event) => {
        setQuantities(event.target.value);
    };

    const nesestId = `P00${GetLatestid(INVENTORYKEY)+1}`;
    const handleSubmit = (event) => {
        event.preventDefault(); 
        const resultData = {
            ...record,
            examineResult,
            acceptanceOpinion,
            putinQuantities: quantities,
            examineTime: currentTime,
        };

        const updatedCheckResults = inicheckresult.map(item => 
            item.recordid === recordid ? resultData : item
        );
       
        
        if (recordid.startsWith('NOT')) {
            const newData={
                productId: nesestId,
                barcode: record.barcode,
                name: record.productname,
                category: productNe.productType,
                stockQuantity: quantities,
                cumulativeInbound: quantities,
                outboundQuantity: 0,
                stockUnit: productNe.stockUnit,
                remarks: ""
            }
            const newproduct = {
                name:record.productname,
                price:productNe.productprice,
                manufacturer:productNe.productionCompany,
                barcode:productNe.barcode,
                description:productNe.productDescription,
            }
            AddnewValue(newproduct,PRODUCTSKEY);
            AddnewValue(newData,INVENTORYKEY);
        }else if(recordid.startsWith('E')){
            const inventoryUpdate = {
                ...invproduct,
                stockQuantity: invproduct.stockQuantity + Number(quantities),
                cumulativeInbound: invproduct.cumulativeInbound + Number(quantities),
            };
            const updatedInventoryResults = initialinventory.map(item => 
                item.barcode === invproduct.barcode ? inventoryUpdate : item
            );    
            setLocalStorage(INVENTORYKEY, updatedInventoryResults, true);
        }
       
        setLocalStorage(CHECKRESULTKEY, updatedCheckResults, true); // 整个数组的更新
    };

    return (
        <div>
            <div>
                申报记录编号：{record.recordid}<br/>
                申报商品名称：{record.productname}
            </div>
            <form onSubmit={handleSubmit}>
                <h3>验收是否通过:</h3>
                <input type="radio" value="yes" checked={examineResult === 'yes'} onChange={handleChange} /> 是
                <input type="radio" value="no" checked={examineResult === 'no'} onChange={handleChange} /> 否
                <br />
                {examineResult && (
                    <div>
                        验收意见： 
                        <input type="text" value={acceptanceOpinion} onChange={handleAcceptanceChange} />
                    </div>
                )}
                {examineResult === 'yes' && (
                    <div>
                        商品入库数量是否需要修改: 
                        <input type='number' value={quantities} onChange={handleQuantitiesChange} /><br/>
                    </div>
                )}
                <br />
                <RealTimeClock setCurrentTime={setCurrentTime} /> {/* 传递状态更新函数 */}
                <input type="submit" value="提交" />
            </form>
        </div>
    );
}
