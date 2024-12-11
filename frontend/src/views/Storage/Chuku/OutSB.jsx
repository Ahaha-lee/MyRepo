import { useState } from "react";
import React from "react";
import { ApplyApi } from "../../../api/storage";
import MainLayout from '../../../utils/MainLayOut/MainLayout.jsx'


export function CKSBPage(){
    return (
        <div>
          <MainLayout rightContent={<ProductOutSB />} />
        </div>
    );
}
export function ProductOutSB() { 
    const [formData, setFormData] = useState({
        title: '', 
        recordID: 0, 
        applyStaffID: '', 
        applyStaffName: '',
        outProductName: '', 
        barcode: '', 
        outReason: '',
        outQuantity: 0,
        outProductUnit: '',
    });
    const [message,setMessage]=useState("");
    const [reminder,setReminder]=useState("");
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit=async (event)=>{
        event.preventDefault();
            formData.applyStaffID =  parseInt=(formData.applyStaffID)
            formData.outQuantity = parseFloat(formData.outQuantity);
       
        try {
            ApplyApi.application(
                {
                    type:"ck",
                    data:formData
                }
            ).then(res=>{
                console.log("cksb返回的数据",res)
                setReminder(res.message)
            })
        } catch (error) {
          console.log("错误信息",error)
          setMessage(error.errormessage)
        }

    };


    return (
        <div className="container" style={{width: '60%'}}>
        <form onSubmit={handleSubmit}>
            <div className="container">
                <h2 className="mb-4">出库申请表单</h2>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">标题：</label>
                    <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} />
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="applyStaffID" className="form-label">申报人ID：</label>
                        <input type="text" className="form-control" name="applyStaffID" value={formData.applyStaffID} onChange={handleChange} />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="applyStaffName" className="form-label">申报人姓名：</label>
                        <input type="text" className="form-control" name="applyStaffName" value={formData.applyStaffName} onChange={handleChange} />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="outProductName" className="form-label">出库商品名称：</label>
                        <input type="text" className="form-control" name="outProductName" value={formData.outProductName} onChange={handleChange} />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="barcode" className="form-label">出库商品条码：</label>
                        <input type="text" className="form-control" name="barcode" value={formData.barcode} onChange={handleChange} />
                    </div>
                </div>
             
                <div className="mb-3">
                    <label htmlFor="outReason" className="form-label">出库原因：</label>
                    <textarea className="form-control" name="outReason" value={formData.outReason} onChange={handleChange}></textarea>
                </div>
                
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="outQuantity" className="form-label">出库数量：</label>
                        <input type="number" className="form-control" name="outQuantity" value={formData.outQuantity} onChange={handleChange} />
                    </div>

                    <div className="col-md-6">
                        <label htmlFor="outProductUnit" className="form-label">数量单位：</label>
                        <input type="text" className="form-control" name="outProductUnit" value={formData.outProductUnit} onChange={handleChange} />
                    </div>
                </div>
            

                <button type="submit" className="btn btn-primary" >提交</button>

                {message && <div className="alert alert-danger mt-3">{message}</div>}
                {reminder && <div className="alert alert-warning mt-3">{reminder}</div>}
            </div>
        </form>
        </div>
          
    );
}    