import { useState } from "react";
import { GetLatestid, AddnewValue } from "../../utils/storageways";
import { OUTAPPLYKEY, OUTPRODUCTSKEY } from "../../Mock/inventoryMock";
import { RealTimeClock } from "../../Components/groceries";
//出库申报表的填写与提交
export function ProductOutSB() {
    const [currentTime, setCurrentTime] = useState(""); 
    const [formData, setFormData] = useState({
        Title:'',
        OutRecordID :'',
        ApplyStaffID :'',
        ApplyStaffName :'',
        OutProductID :'',
        OutProductName :'',
        OutProductBarcode:'', 
        OutBoundReason :'',
        OutboundQuantity:'',
        OutQuantityUnit :'',
        OutApplyTime :'',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const latestId = GetLatestid(OUTAPPLYKEY);
        console.log(latestId);
        const outrecordid = `OUT${latestId}`;
        console.log(outrecordid)
        const updatedData = { ...formData, OutRecordID: outrecordid , OutApplyTime:currentTime}; 
        console.log(updatedData);
        AddnewValue(updatedData,OUTAPPLYKEY);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
            出库申报：<br />
            标题：<input type="text" name="Title" value={formData.Title} onChange={handleChange} /><br />
            申报人ID：<input type="text" name="ApplyStaffID" value={formData.ApplyStaffID} onChange={handleChange} /><br />
            申报人姓名：<input type="text" name="ApplyStaffName" value={formData.ApplyStaffName} onChange={handleChange} /><br />
            出库商品ID：<input type="text" name="OutProductID" value={formData.OutProductID} onChange={handleChange} /><br />
            出库商品名称：<input type="text" name="OutProductName" value={formData.OutProductName} onChange={handleChange} /><br />
            出库商品条码：<input type="text" name="OutProductBarcode" value={formData.OutProductBarcode} onChange={handleChange} /><br />
            出库原因：<input type="text" name="OutBoundReason" value={formData.OutBoundReason} onChange={handleChange} /><br />
            出库数量：<input type="number" name="OutboundQuantity" value={formData.OutboundQuantity} onChange={handleChange} /><br />
            数量单位：<input type='text' name="OutQuantityUnit" value={formData.OutQuantityUnit} onChange={handleChange} /><br />
            申报时间：<RealTimeClock setCurrentTime={setCurrentTime} /><br />
            <button type="submit">提交</button>
        </form>
        </div>
    );
}
