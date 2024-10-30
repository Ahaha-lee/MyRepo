import React, { useState } from 'react';
import { RealTimeClock } from '../../Components/groceries';


// 采购申报表的书写和提交 提交的表单都放一个数据 至于为什么分已存在或者事新商品 是为了后面的自动输入信息
// 采购专员提交申报表（顶级Boss和采购专员模式下可实现采购申报） 完成整改以后实现（采购专员填写表单如果是已存在的信息可以自动的补充在输入中）

export function ApplyForCaiGou() {  
    const [formData, setFormData] = useState({  
        recordID:'',             
        purchaserStaffID:'',
        title:'',
        purchaserStaffName:'',
        cGProductBarcode:'',
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
        supplierID:'',
        supplierAddress:'',
        supplierContactName:'',
        supplierContactPhone:'',
        supplierContactStandby:'',
        supplierEmail:'',
    });


    const handleChange = (event) => {
        setFormData(prevData => ({
          ...prevData,
          [event.target.name]: event.target.value
        }));
      };

    const handleSubmit=async (event)=>{
        event.preventDefault();
      
        formData.cGCostPrice = parseFloat(formData.cGCostPrice);
        formData.cGQuantity = parseFloat(formData.cGQuantity);
        const tablename ="Procurement"
        const tablename1="InboundRecords"
        try {
            const response = await fetch(`/api/declaration?tablename=${tablename}&&tablename1=${tablename1}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            });
            if (!response.ok) {
            throw new Error('插入数据失败');
            }
            alert("采购申报成功")
            // const data = await response.text();
            // setMessage(data);
        } catch (error) {
            return error.message;
        }

    };

    return (
        <form onSubmit={handleSubmit}>
            <div>采购申报</div>         
            <>
        标题：
        <input type='text' name="title" value={formData.titleitle} onChange={handleChange}  /><br />
        采购员工ID：
        <input type="text" name="purchaserStaffID" value={formData.purchaserStaffID} onChange={handleChange} /><br />        
        采购员工名字：
        <input type="text" name="purchaserStaffName" value={formData.purchaserStaffName} onChange={handleChange} /><br />
        
        1、入库商品名称：
        <input type="text" name="cGProductName" value={formData.cGProductName} onChange={handleChange} /><br />
        
        2、入库商品条码：
        <input type="text" name="cGProductBarcode" value={formData.cGProductBarcode} onChange={handleChange} /><br />
        
        3、入库商品类型：
        <input type="text" name="cGProCategory" value={formData.cGProCategory} onChange={handleChange} /><br />
        
        4、入库商品数量：
        <input type="number" name="cGQuantity" value={formData.cGQuantity} onChange={handleChange} /><br />
        
        5、入库商品数量单位：
        <input type="text" name="cGProductUnit" value={formData.cGProductUnit} onChange={handleChange} /><br />
        
        6、入库商品成本价：
        <input type="number" name="cGCostPrice" value={formData.cGCostPrice} onChange={handleChange} /><br />
        
        7、入库商品描述：
        <textarea name="productDescription" value={formData.productDescription} onChange={handleChange} /><br />
        
        8、入库商品生产公司：
        <input type="text" name="productionCompany" value={formData.productionCompany} onChange={handleChange} /><br />

        8、商品生产地址：
        <input type="text" name="productAddress" value={formData.productAddress} onChange={handleChange} /><br />
                
        9、选择该商品的理由：
        <textarea name="selectReason" value={formData.selectReason} onChange={handleChange} /><br />
        
        10、供应商名称：
        <input type="text" name="supplierName" value={formData.supplierName} onChange={handleChange} /><br />
        10、供应商ID：
        <input type="text" name="supplierID" value={formData.supplierID} onChange={handleChange} /><br />
        
        12、供应商地址：
        <input type="text" name="supplierAddress" value={formData.supplierAddress} onChange={handleChange} /><br />
        
        13、供应商直接联系人姓名：
        <input type="text" name="supplierContactName" value={formData.supplierContactName} onChange={handleChange} /><br />
        
        14、供应商直接联系人电话：
        <input type="text" name="supplierContactPhone" value={formData.supplierContactPhone} onChange={handleChange} /><br />
        
        15.供应商公司邮件：
        <input type="text" name="supplierEmail" value={formData.supplierEmail} onChange={handleChange} /><br />
        16、供应商备用联系号码：
        <input type="text" name="supplierContactStandby" value={formData.supplierContactStandby} onChange={handleChange} /><br />
        
            <button type="submit">提交</button>
            </>
        </form>
    );
}