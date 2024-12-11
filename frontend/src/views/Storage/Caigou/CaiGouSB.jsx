import React, { useState,useEffect } from 'react';
import { ApplyApi } from '../../../api/storage';
import MainLayout from '../../../utils/MainLayOut/MainLayout.jsx'
import { useLocation } from 'react-router-dom';
import { DeclaretionApi } from '../../../api/storage';



export function CGSBPage(){
    return (
        <div>
            <MainLayout rightContent={<CaiGouAddUpdateForm/>} />
        </div>
    )
}

export function ProcurementUpdatePage(){
    const location = useLocation();

    const { procurement} = location.state || {}; 

    if (!procurement) {
        return <div>没有找到需要修改的申请表信息</div>;
    }
    return(
        <div>
            <MainLayout rightContent={<CaiGouAddUpdateForm procurementinfo={procurement}/>}/>
        </div>
    )
}
export function CaiGouAddUpdateForm({procurementinfo,updatedisable}) {  
    console.log("procurementinfo",procurementinfo)
    console.log("dis",updatedisable)
    const [formData, setFormData] = useState({  
        recordID:0,           
        purchaserStaffID:0,
        title:'',
        purchaserStaffName:'',
        barcode:'',
        cGProCategory:'',
        cGProductName:'',
        cGCostPrice:'',
        cGQuantity:'',
        cGProductUnit:'',
        productionCompany:'',
        productAddress:'',
        productDescription:'',
        selectReason:'',
        supplierName:'',
        supplierID:0,
        supplierAddress:'',
        supplierContactName:'',
        supplierContactPhone:'',
        supplierContactStandby:'',
        supplierEmail:'',
        applyDate:new Date(),
    });
    const [message,setMessage]=useState("");
    const [reminder,serReminder]=useState("");
    const [disable,setDisable]=useState(true);

    useEffect(() => {
        if (procurementinfo) {
            setFormData({
                recordID: procurementinfo.recordID,
                purchaserStaffID: procurementinfo.purchaserStaffID,
                title: procurementinfo.title,
                purchaserStaffName: procurementinfo.purchaserStaffName,
                barcode: procurementinfo.barcode,
                cGProCategory: procurementinfo.cgProCategory,
                cGProductName: procurementinfo.cgProductName,
                cGCostPrice: procurementinfo.cgCostPrice,
                cGQuantity: procurementinfo.cgQuantity,
                cGProductUnit: procurementinfo.cgProductUnit,
                productionCompany: procurementinfo.productionCompany,
                productAddress: procurementinfo.productAddress,
                productDescription: procurementinfo.productDescription,
                selectReason: procurementinfo.selectReason,
                supplierName: procurementinfo.supplierName,
                supplierID: procurementinfo.supplierID,
                supplierAddress: procurementinfo.supplierAddress,
                supplierContactName: procurementinfo.supplierContactName,
                supplierContactPhone: procurementinfo.supplierContactPhone,
                supplierContactStandby: procurementinfo.supplierContactStandby,
                supplierEmail: procurementinfo.supplierEmail,
                applyDate: procurementinfo.applyDate,
            });
        }
    }, [procurementinfo]);

  

    const handleChange = (event) => {
        setFormData(prevData => ({
          ...prevData,
          [event.target.name]: event.target.value
        }));
      };

    const handleSubmit=(event)=>{
        event.preventDefault();
        
        formData.recordID=parseInt(formData.recordID);
        formData.purchaserStaffID=parseInt(formData.purchaserStaffID);
        formData.supplierID=parseInt(formData.supplierID);
        formData.cGCostPrice = parseFloat(formData.cGCostPrice);
        formData.cGQuantity = parseFloat(formData.cGQuantity);
    
     
        try{
            if (procurementinfo){
                DeclaretionApi.updatecg({
                    params:{update_id:procurementinfo.recordID},
                    data:formData
                }).then(res=>{
                    console.log("修改采购申请表成功",res)
                })
            }else{
                ApplyApi.application({
                    type:"cg",
                    data:formData
                }).then(res=>{
                    console.log("cgsb返回的数据",res)
                    serReminder(res.message)
                })
        }
        }catch(error){
            console.log("错误",error)
            setMessage(error.errormessage)
        }

      
    };
    console.log("123",disable)

    return (
    <div className="container" style={{width: '60%'}}>
        <form onSubmit={handleSubmit}>
        <h2 className="text-center">{procurementinfo ? "修改申请表信息" : "采购申请表申报"}</h2>
            <div className="mb-3">
                <label htmlFor="title" className="form-label">标题：</label>
                <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} />
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="purchaserStaffID" className="form-label">采购员工ID：</label>
                    <input type="text" className="form-control" name="purchaserStaffID" value={formData.purchaserStaffID} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="purchaserStaffName" className="form-label">采购员工名字：</label>
                    <input type="text" className="form-control" name="purchaserStaffName" value={formData.purchaserStaffName} onChange={handleChange} />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="cGProductName" className="form-label">入库商品名称：</label>
                    <input type="text" className="form-control" name="cGProductName" value={formData.cGProductName} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="barcode" className="form-label">入库商品条码：</label>
                    <input type="text" className="form-control" name="barcode" value={formData.barcode} onChange={handleChange} />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="cGProCategory" className="form-label">入库商品类型：</label>
                    <input type="text" className="form-control" name="cGProCategory" value={formData.cGProCategory} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="cGQuantity" className="form-label">入库商品数量：</label>
                    <input type="number" className="form-control" name="cGQuantity" value={formData.cGQuantity} onChange={handleChange} />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="cGProductUnit" className="form-label">入库商品数量单位：</label>
                    <input type="text" className="form-control" name="cGProductUnit" value={formData.cGProductUnit} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="cGCostPrice" className="form-label">入库商品成本价：</label>
                    <input type="text" className="form-control" name="cGCostPrice" value={formData.cGCostPrice} onChange={handleChange} />
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="productDescription" className="form-label">入库商品描述：</label>
                <textarea className="form-control" name="productDescription" value={formData.productDescription} onChange={handleChange}></textarea>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="productionCompany" className="form-label">入库商品生产公司：</label>
                    <input type="text" className="form-control" name="productionCompany" value={formData.productionCompany} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="productAddress" className="form-label">商品生产地址：</label>
                    <input type="text" className="form-control" name="productAddress" value={formData.productAddress} onChange={handleChange} />
                </div>
            </div>

            <div className="mb-3">
                <label htmlFor="selectReason" className="form-label">选择该商品的理由：</label>
                <textarea className="form-control" name="selectReason" value={formData.selectReason} onChange={handleChange}></textarea>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="supplierName" className="form-label">供应商名称：</label>
                    <input type="text" className="form-control" name="supplierName" value={formData.supplierName} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="supplierID" className="form-label">供应商ID：</label>
                    <input type="text" className="form-control" name="supplierID" value={formData.supplierID} onChange={handleChange} />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="supplierAddress" className="form-label">供应商地址：</label>
                    <input type="text" className="form-control" name="supplierAddress" value={formData.supplierAddress} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="supplierContactName" className="form-label">供应商直接联系人姓名：</label>
                    <input type="text" className="form-control" name="supplierContactName" value={formData.supplierContactName} onChange={handleChange} />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="supplierContactPhone" className="form-label">供应商直接联系人电话：</label>
                    <input type="text" className="form-control" name="supplierContactPhone" value={formData.supplierContactPhone} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="supplierEmail" className="form-label">供应商公司邮件：</label>
                    <input type="email" className="form-control" name="supplierEmail" value={formData.supplierEmail} onChange={handleChange} />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="supplierContactStandby" className="form-label">供应商备用联系号码：</label>
                    <input type="text" className="form-control" name="supplierContactStandby" value={formData.supplierContactStandby} onChange={handleChange} />
                </div>
            </div>

            <button type="submit" className="btn btn-primary">提交</button>
         </form>

        <div>
            {message && <div className='alert alert-success'>{message}</div>}
            {reminder && <div className='alert alert-danger'>{reminder}</div>}
        </div>
    </div>
    );
}