import React, { useState } from 'react';
import { AddnewValue, GetLatestid, } from '../../utils/storageways';
import { INBOUNDRECORDKEY, PROCUREMENTKEY } from '../../Mock/inventoryMock';
import { RealTimeClock } from '../../Components/groceries';

// 采购申报表的书写和提交 提交的表单都放一个数据 至于为什么分已存在或者事新商品 是为了后面的自动输入信息
// 采购专员提交申报表（顶级Boss和采购专员模式下可实现采购申报） 完成整改以后实现（采购专员填写表单如果是已存在的信息可以自动的补充在输入中）

export function ApplyForICaiGou() {
    const [formData, setFormData] = useState({
        Title: '', // 标题
        RecordID: '', // 采购记录ID
        PurchaserStaffID: '', // 采购员工ID
        PurchaserStaffName: '', // 采购员工姓名
        CGProductBarcode: '', // 商品条码
        CGProCategory: '', // 商品类别
        CGProductName: '', // 商品名称
        CGCostPrice: 0.00, // 成本价
        CGQuantity: 0, // 数量
        CGProductUnit: '', // 单位
        ProductionCompany: '', // 生产公司
        ProductAddress: '', // 生产地点 省市县
        ProductDescription: '', // 产品描述
        SelectReason: '', // 选择该商品的理由
        SupplierName: '', // 供应商名称
        SupplierID: '', // 供应商ID
        SupplierAddress: '', // 供应商地址
        SupplierContactName: '', // 供应商直接联系人
        SupplierContactPhone: '', // 供应商直接联系人电话号码
        SupplierContactStandby: '', // 供应商备用联系号码
        SupplierEmail: '', // 供应商公司邮件
        ApplyDate: null // 申报表提交时间
    });
    const [stockExists, setStockExists] = useState(null);


    const handleStockChange = (event) => {
        setStockExists(event.target.value === 'yes');
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (stockExists) {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const isConfirmed = window.confirm('您确定要提交表单吗？');
        

        if (isConfirmed) {
            const formatedExisted = `E${GetLatestid(PROCUREMENTKEY)}`;
            console.log(formatedExisted);
            const formatedNotExisted = `NOTE${GetLatestid(PROCUREMENTKEY)}`;
            console.log(formatedNotExisted);
            console.log(stockExists)
            if (stockExists) {
                const product = { ...formData, RecordID: formatedExisted };
                const recorddata={
                     Title:product.Title,
                     RecordID: product.RecordID,
                     INReProductName:product.CGProductName,
                     INReBarcode:product.CGProductBarcode,
                     ApplyStaffID :product.ApplyStaffID,
                     ApplyStaffName:product.PurchaserStaffName,
                     ApplyCostPrice:product.CGCostPrice,
                     ApplyQuantities:product.CGQuantity,
                     ApplyDate:product.ApplyDate,
              }
                AddnewValue(product,PROCUREMENTKEY)
                AddnewValue(recorddata,INBOUNDRECORDKEY)
                
            } else if(!stockExists) {
                const product = { ...formData, RecordID:formatedNotExisted};
                const recorddata={
                    Title:product.Title,
                    RecordID: product.RecordID,
                    INReProductName:product.CGProductName,
                    INReBarcode:product.CGProductBarcode,
                    ApplyStaffID :product.ApplyStaffID,
                    ApplyStaffName:product.PurchaserStaffName,
                    ApplyCostPrice:product.CGCostPrice,
                    ApplyQuantities:product.CGQuantity,
                    ApplyDate:product.ApplyDate,
             }
               AddnewValue(product,PROCUREMENTKEY)
               AddnewValue(recorddata,INBOUNDRECORDKEY)
            }
            
        } else {
            alert('提交已取消');
        }
        
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>采购申报</div>
            库存是否已存在此商品：
            <input type="radio" name="stockExists" value="yes" onChange={handleStockChange} /> 是
            <input type="radio" name="stockExists" value="no" onChange={handleStockChange} /> 否<br/>
            {stockExists && (
             <>
             标题：
            <input type='text' name="Title" value={formData.Title} onChange={handleChange} required /><br />
            
            采购员工ID：
            <input type="text" name="PurchaserStaffID" value={formData.PurchaserStaffID} onChange={handleChange} required /><br />
            
            采购员工名字：
            <input type="text" name="PurchaserStaffName" value={formData.PurchaserStaffName} onChange={handleChange} required /><br />
            
            1、入库商品名称：
            <input type="text" name="CGProductName" value={formData.CGProductName} onChange={handleChange} required /><br />
            
            2、入库商品条码：
            <input type="text" name="CGProductBarcode" value={formData.CGProductBarcode} onChange={handleChange} required /><br />
            
            3、入库商品类型：
            <input type="text" name="CGProCategory" value={formData.CGProCategory} onChange={handleChange} required /><br />
            
            4、入库商品数量：
            <input type="number" name="CGQuantity" value={formData.CGQuantity} onChange={handleChange} required /><br />
            
            5、入库商品数量单位：
            <input type="text" name="CGProductUnit" value={formData.CGProductUnit} onChange={handleChange} required /><br />
            
            6、入库商品成本价：
            <input type="text" name="CGCostPrice" value={formData.CGCostPrice} onChange={handleChange} required /><br />
            
            7、入库商品描述：
            <textarea name="ProductDescription" value={formData.ProductDescription} onChange={handleChange} required /><br />
            
            8、入库商品生产公司：
            <input type="text" name="ProductionCompany" value={formData.ProductionCompany} onChange={handleChange} required /><br />
            
            9、选择该商品的理由：
            <textarea name="SelectReason" value={formData.SelectReason} onChange={handleChange} required /><br />
            
            10、供应商名称：
            <input type="text" name="SupplierName" value={formData.SupplierName} onChange={handleChange} required /><br />
            
            12、供应商地址：
            <input type="text" name="SupplierAddress" value={formData.SupplierAddress} onChange={handleChange} required /><br />
            
            13、供应商直接联系人姓名：
            <input type="text" name="SupplierContactName" value={formData.SupplierContactName} onChange={handleChange} required /><br />
            
            14、供应商直接联系人电话：
            <input type="text" name="SupplierContactPhone" value={formData.SupplierContactPhone} onChange={handleChange} required /><br />
            
            15.供应商公司邮件：
            <input type="text" name="SupplierEmail" value={formData.SupplierEmail} onChange={handleChange} required /><br />
            16、供应商备用联系号码：
            <input type="text" name="SupplierContactStandby" value={formData.SupplierContactStandby} onChange={handleChange} /><br />
            
            17、申报日期时间即提交时间：
            <br /> <RealTimeClock />
            
            <button type="submit">提交</button>
            </>
            )}
        </form>
    );
}
