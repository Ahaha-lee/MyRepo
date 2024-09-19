import { useParams } from "react-router-dom";
import {getLocalStorage, setLocalStorage } from "../../utils/storageways";
import { useState } from "react";
import { RealTimeClock } from "../../Components/groceries";
import useSession from "../../useSession";
import { PROCUREMENTKEY,INBOUNDRECORDKEY } from "../../Mock/inventoryMock";

//采购申请表同意以后，采购专员向供应商订货,商品入仓库（订货单问题之后记得考虑），记得仓库管理员起作用了 
// 这个操作只有顶级boss和仓库管理员可操作
export function CaiGouReceive() {
    //采购记录表
    const InboundRecordsTable = getLocalStorage(INBOUNDRECORDKEY, true);
    const procurement = getLocalStorage(PROCUREMENTKEY,true);
    const { recordid } = useParams();
    const product =  procurement.find(item=>item.RecordID===recordid);

    const tempt = product. CGQuantity;//这个是申报表中的申请数量

    const [putinQuantities, setPutinQuantities] = useState(tempt); // 入库数量
    const [currentTime, setCurrentTime] = useState(""); // 入库时间
    const [putinResult, setPutinResult] = useState(null);
    const [location,setlocation] =  useState('');
    const {getSession} = useSession();
    const StorageStaff = getSession()
       

    let productrecord = null;
    if(InboundRecordsTable.length>0){
    // 查找匹配的记录
     productrecord =InboundRecordsTable .find(item => item.RecordID === recordid);
    }

    if(!productrecord || productrecord?.checkResult==='no')
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
            ...productrecord,
            StorehouseStaffID:StorageStaff. EmployeeID,
            PutINResult:putinResult,
            PutInQuantities:putinQuantities,
            PutInDate: currentTime,
            REINVLocation:location,

        };
        const updatedCheckResults = InboundRecordsTable.map(item =>
            item.RecordID === recordid ? resultData : item
        );
        setLocalStorage(INBOUNDRECORDKEY, updatedCheckResults, true); // 整个数组的更新
    };

    return (
        <div>
            <div>
                审报审核通过商品入库<br/>
                申报记录编号：{productrecord.RecordID}<br />
                申报申请人ID:{productrecord.ApplyStaffID}<br/>
                申报申请人名字:{productrecord.ApplyStaffName}<br/>
                申报商品名称：{productrecord.INReProductName}<br />
                申报商品条码：{productrecord.INReBarcode}<br/>
                审核负责人:{productrecord.CheckStaffID}<br/>
            </div>
            <form onSubmit={handleSubmit}>
                <h3>是否完成入库:</h3>
                <input type="radio" value="yes" checked={putinResult === 'yes'} onChange={handleChange} /> 是
                <input type="radio" value="no" checked={putinResult === 'no'} onChange={handleChange} /> 否
                <br />
                {putinResult && (
                    <div>
                        入库数量(是否区别于申报表中的入库数量)：
                        <input  type="number" 
                                value={putinQuantities} 
                                onChange={handleQuantitiesChange}
                                 /><br/>
                        商品所处仓库位置:
                        <input type="text"
                               value={location}
                               onChange={event => setlocation(event.target.value)}/>

                    </div>
                )}
                <br />
                <RealTimeClock setCurrentTime={setCurrentTime} /> {/* 传递状态更新函数 */}
                <input type="submit" value="提交" />
            </form>
        </div>
    );
}
