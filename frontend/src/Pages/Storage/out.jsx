import { useState } from "react";
import useSession from "../../useSession";
import { useParams } from "react-router-dom";
import { AddnewValue, getLocalStorage, setLocalStorage } from "../../utils/storageways";
import { INVENTORYKEY, OUTCHECKREKEY, OUTCHECKRESULT, OUTRECORDKEY } from "../../Mock/inventoryMock";
import { RealTimeClock } from "../../Components/groceries";

// 出库功能的出库 就是理货员提交出库申报 审核通过申报表，进行出库 这个功能页面 理货员账号下也得来一张 出库时理货员的操作
export function ProductOut(){

    const [OutResult,setOutResult] = useState(null);
    const [OutOpinion,setOutOpinion] = useState("");
    const [currentTime,setCurrentTime] = useState();
    const iniproductoutrecord = getLocalStorage(OUTRECORDKEY,true)||[];
    const initialINVENTORY = getLocalStorage(INVENTORYKEY,true)||[];
    const {outrecordid} = useParams();
    const { getSession } = useSession();
    const Incharge = getSession();

    const outrecord = iniproductoutrecord.find(item => item.OBReOutRecordID === outrecordid);
    const invproduct = initialINVENTORY.find(item=>item.INVBarcode===outrecord.OBReProductBarcode );
    const [OutQuantities,setOutQuantities] = useState(outrecord.OBReApplyQuantityUnit);
    if(!outrecord||outrecord.checkResult==='no'){
        return(<div>
            不可出库（请确认是否通过审核）
        </div>)
    }
    const handleChange=(event)=>{
        setOutResult(event.target.value);
    }
    const handleOpinionChange=(event)=>{
        setOutOpinion(event.target.value);
    }
    const handleQuantitiesChange=(event)=>{
        setOutQuantities(event.target.value);
    }
    const handleSubmit=(event)=>{
        event.preventDefault(); 
        const resultData = {
            ...outrecord,
            OutResult,
            OutQuantities,
            StoragestaffId:Incharge.EmployeeID,
            StoragestaffName:Incharge.FirstName+Incharge.LastName,
            OutTime: currentTime,
        };
        const updatedOutResults = iniproductoutrecord.map(item => 
            item.OBReOutRecordID === outrecordid ? resultData : item
        );
        const inventoryUpdate = {
            ...invproduct,
            stockQuantity: invproduct.stockQuantity -Number(OutQuantities),
            outboundQuantity:invproduct.outboundQuantity+Number(OutQuantities),
        };
        const updatedInventoryResults = initialINVENTORY.map(item => 
            item. OBReProductBarcode === invproduct.INVBarcode ? inventoryUpdate : item
        );    
        setLocalStorage(INVENTORYKEY, updatedInventoryResults, true);
        setLocalStorage(OUTRECORDKEY,updatedOutResults,true)
       
    }
    return (
        <div>
              <form onSubmit={handleSubmit}>
                是否已经出库:<br/>
                <input type="radio" value="yes" checked={OutResult === 'yes'} onChange={handleChange}/> 是
                <input type="radio" value="no" checked={OutResult === 'no'} onChange={handleChange}/> 否<br/>
                {OutResult && (
                    <div>
                        出库数量：<input type='number' value={OutQuantities} onChange={handleQuantitiesChange} placeholder="出库默认数量为申报出库数量，如遇特殊情况，请备注原因！"/>
                        <br/>
                        备注：：<input type="text" value={OutOpinion} onChange={handleOpinionChange} />
                    </div>
                )}
                <br />
                <RealTimeClock setCurrentTime={setCurrentTime} /> 
                <input type="submit" value="提交"/>
            </form>
        </div>
    );
}