import { useState } from "react";
import { RealTimeClock } from "../../Components/groceries";
//出库申报表的填写与提交
export function ProductOutSB() { 
    const [currenttime,setCurrentTime] = useState()
    const [formData, setFormData] = useState({
        title: '', 
        recordID: '', 
        applyStaffID: '', 
        applyStaffName: '',
        outProductName: '', 
        outProductBarcode: '', 
        outReason: '',
        outQuantity: 0,
        outProductUnit: '',
        outApplyTime: '2024-01-01 00:00:00',
    });
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit=async (event)=>{
        event.preventDefault();
        formData.outQuantity = parseFloat(formData.outQuantity);

        const tablename ="OutDeclaration"
        const tablename1="OutStorageRecords"
        try {
            const response = await fetch(`/api/declaration?tablename=${tablename}&&tablename1=${tablename1}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            });
            console.log("formdata",JSON.stringify(formData))
            if (!response.ok) {
            throw new Error('插入数据失败');
            }
            alert("出库申报成功")

        } catch (error) {
            return error.message;
        }

    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                出库申报：<br />
                标题：<input type="text" name="title" value={formData.title} onChange={handleChange} /><br />
                申报人ID：<input type="text" name="applyStaffID" value={formData.applyStaffID} onChange={handleChange} /><br />
                申报人姓名：<input type="text" name="applyStaffName" value={formData.applyStaffName} onChange={handleChange} /><br />
                出库商品名称：<input type="text" name="outProductName" value={formData.outProductName} onChange={handleChange} /><br />
                出库商品条码：<input type="text" name="outProductBarcode" value={formData.outProductBarcode} onChange={handleChange} /><br />
                出库原因：<input type="text" name="outReason" value={formData.outReason} onChange={handleChange} /><br />
                出库数量：<input type="number" name="outQuantity" value={formData.outQuantity} onChange={handleChange} /><br />
                数量单位：<input type='text' name="outProductUnit" value={formData.outProductUnit} onChange={handleChange} /><br />
                申报时间：<RealTimeClock setCurrentTime={setCurrentTime} /><br />
                <button type="submit">提交</button>
            </form>
        </div>
    );
}    