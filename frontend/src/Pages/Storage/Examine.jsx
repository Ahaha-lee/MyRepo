import { useState } from "react";
import { CGNOTEXISTEDKEY, CHECKRESULTKEY, INBOUNDRECORDKEY, INVENTORYKEY, PROCUREMENTKEY } from "../../Mock/inventoryMock"; 
import { AddnewValue, getLocalStorage, setLocalStorage,GetLatestid } from "../../utils/storageways";
import { RealTimeClock } from "../../Components/groceries";
import { useParams } from "react-router-dom";
import { PRODUCTSKEY } from "../../Mock/productsMock";
import useSession from "../../useSession";

// 采购验收 采购流程的最后一个阶段  在商品入库以后 审核负责人要到仓库进行验收 


export function CaiGouExamine() {
    const Inboundrecord = getLocalStorage(INBOUNDRECORDKEY, true);
    const initialinventory = getLocalStorage(INVENTORYKEY, true);
    const inshenbaobiao = getLocalStorage(PROCUREMENTKEY,true);
    const { recordid } = useParams(); // URL获得recordid
    const [examineResult, setExamineResult] = useState('');
    const [acceptanceOpinion, setAcceptanceOpinion] = useState('');  
    const [currentTime, setCurrentTime] = useState(""); 
    const {getSession} = useSession();
    const examinestaff = getSession();

    const shenbaodata = inshenbaobiao.find(item=>item.RecordID===recordid);
    const record = Inboundrecord.find(item => item.RecordID === recordid);
    const [quantities, setQuantities] = useState(record.PutInQuantities);
    const invproduct = initialinventory.find(item => item.INVBarcode === record.INReBarcode)||'noExisted';
    if(record.CheckResult==='no'||
        record.PutINResult ==='no'
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

    const nextId = `I00${GetLatestid(INVENTORYKEY)+1}`;
    const pronextId = `P00${GetLatestid(PRODUCTSKEY)+1}`;
    const handleSubmit = (event) => {
        event.preventDefault(); 
        const resultData = {
            ...record,
            ExamineStaffID: examinestaff.EmployeeID,
            ExamineResult:examineResult,
            ExamineOpinion:acceptanceOpinion,
            ExamineQuantities: quantities,//验收通过的数量 默认是入库数量 最终入库数量
            ExamineDate: currentTime,
        };

        const updatedCheckResults =Inboundrecord.map(item => 
            item.RecordID === recordid ? resultData : item
        );     
        
        //商品总表和库存总表的更新
        if (recordid.startsWith('NOT')) {
            const newinvData={
                InventoryID: nextId,
                INVBarcode: record.INReBarcode,
                INVProductName: record.InReProductName,
                Category: shenbaodata. CGProCategory,
                stockUnit:record.QuantityUnit,
                stockQuantity: quantities,
                cumulativeInbound: quantities,
                outboundQuantity: 0,
                remarks: "",
                INVLocation:record.REINVLocation,
            }
        
            const newproduct = {
                ProductID:pronextId,
                PROBarcode:record.INReBarcode,
                Category:shenbaodata.CGProCategory,
                ProductName:record.InReProductName,
                CostPrice:record.INReCostPrice,
                RetailPrice:"",
                DetailedlyDesc:shenbaodata.ProductDescription,
                PROLocation:"",
            }

            AddnewValue(newproduct,PRODUCTSKEY);
            AddnewValue(newinvData,INVENTORYKEY);
        }else if(recordid.startsWith('E')){
            const inventoryUpdate = {
                ...invproduct,
                stockQuantity: invproduct.stockQuantity + Number(quantities),
                cumulativeInbound: invproduct.cumulativeInbound + Number(quantities),
            };
            const updatedInventoryResults = initialinventory.map(item => 
                item.INVBarcode === invproduct.INVBarcode ? inventoryUpdate : item
            );    
            setLocalStorage(INVENTORYKEY, updatedInventoryResults, true);
        }
       
        setLocalStorage(INBOUNDRECORDKEY, updatedCheckResults, true); // 整个数组的更新
    };
   
    return (
        <div>
            <div>
                申报审核通过商品验收记录:
                申报记录编号：{record.RecordID}<br />
                申报申请人ID:{record.ApplyStaffID}<br/>
                申报申请人名字:{record.ApplyStaffName}<br/>
                申报商品名称：{record.INReProductName}<br />
                申报商品条码：{record.INReBarcode}<br/>
                审核负责人:{record.CheckStaffID}<br/>
                入库负责人:{record. StorehouseStaffID }<br/>
                入库数量:{record.PutInQuantities}<br/>
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
