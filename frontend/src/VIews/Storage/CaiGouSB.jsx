import React, { useState } from 'react';
import { AddnewValue, GetLatestid} from '../../utils/storageways';
import { CAIGOUSBKEY } from '../../Mock/inventoryMock';
import { RealTimeClock } from '../../Components/groceries';

// 申报记录的id写了吗，没有啊

export function ApplyForICaiGou() {
    //已存在过商品
    const [formDataYes, setFormDataYes] = useState({
        recordid:'', 
        productName: '',
        productType: '',
        productQuantity: '',
        productUnit: '',
        productDescription: '',
        productionCompany: '',
        purchaserId: '',
        purchaserName: '',
        supplierId: '',
        supplierName: '',
        productPrice: '',
        reasonForSelection: '',
        priceChangeReason: '',
        productBarcode:'',
        productId:'',
    });
    // 新添置商品
    const [formDataNo, setFormDataNo] = useState({
        recordid:'',
        productName: '',
        productType: '',
        productQuantity: '',
        productUnit: '',
        productDescription: '',
        productionCompany: '',
        purchaserId: '',
        purchaserName: '',
        supplierName: '',
        supplierContact: '',
        supplierAddress: '',
        supplierContactName: '',
        supplierContactPhone: '',
        productPrice: '',
        reasonForSelection: '',
    });

    const [stockExists, setStockExists] = useState(null);
    
    const nowtime = RealTimeClock();
    const formattedDate = nowtime.toISOString().slice(0, 19);

    const handleStockChange = (event) => {
        setStockExists(event.target.value === 'yes');
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (stockExists) {
            setFormDataYes(prevData => ({
                ...prevData,
                [name]: value
            }));
        } else {
            setFormDataNo(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const isConfirmed = window.confirm('您确定要提交表单吗？');

        if (isConfirmed) {
            //stockExits ===yes 为true
            const newRecordId=GetLatestid(CAIGOUSBKEY);
            if (stockExists) {
                const updatedData = { ...formDataYes, recordid: newRecordId };
                AddnewValue(updatedData,CAIGOUSBKEY)
            } else {
                const updatedData = { ...formDataYes, recordid: newRecordId };
                AddnewValue(updatedData,CAIGOUSBKEY)
            }
            alert('表单已提交');
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
            {/* 未存在此商品 */}
            {stockExists === false && (
                <>
                1、入库商品名称：
                <input type="text" name="productName" value={formDataNo.productName} onChange={handleChange} required /><br />
                2、入库商品类型：
                <input type="text" name="productType" value={formDataNo.productType} onChange={handleChange} required /><br />
                3、入库商品数量：
                <input type="number" name="productQuantity" value={formDataNo.productQuantity} onChange={handleChange} required /><br />
                4、入库商品数量单位：
                <input type="text" name="productUnit" value={formDataNo.productUnit} onChange={handleChange} required /><br />
                5、入库商品描述：
                <textarea name="productDescription" value={formDataNo.productDescription} onChange={handleChange} required/><br />
                6、入库商品生产公司：
                <input type="text" name="productionCompany" value={formDataNo.productionCompany} onChange={handleChange} required /><br />
                7、采购负责人编号：
                <input type="text" name="purchaserId" value={formDataNo.purchaserId} onChange={handleChange} required /><br />
                8、采购负责人姓名：
                <input type="text" name="purchaserName" value={formDataNo.purchaserName} onChange={handleChange} required /><br />
                {/* 未考虑情况供应商已存在 */}
                9、供应商名称：
                <input type="text" name="supplierName" value={formDataNo.supplierName} onChange={handleChange} required /><br />
                10、供应商联系电话：
                <input type="text" name="supplierContact" value={formDataNo.supplierContact} onChange={handleChange} required /><br />
                11、供应商地址：
                <input type="text" name="supplierAddress" value={formDataNo.supplierAddress} onChange={handleChange} required /><br />
                12、供应商直接联系人姓名：
                <input type="text" name="supplierContactName" value={formDataNo.supplierContactName} onChange={handleChange} required /><br />
                13、供应商直接联系人电话：
                <input type="text" name="supplierContactPhone" value={formDataNo.supplierContactPhone} onChange={handleChange} required /><br />
                14、入库商品单价：
                <input type="text" name="productPrice" value={formDataNo.productPrice} onChange={handleChange} required /><br />
                15、选择该商品的理由：
                <textarea name="reasonForSelection" value={formDataNo.reasonForSelection} onChange={handleChange} required /><br />
                16、申报日期时间即提交时间
                <br/>{formattedDate}
                </>
            )}
            {/* 已存在此商品 */}
            {stockExists === true && (
                <>
                1、入库商品名称：
                <input type="text" name="productName" value={formDataYes.productName} onChange={handleChange} required /><br />
                {/* 2、入库商品条形码：
                <input type="text" name="productBarode" value={formDataYes.productBarcode} onChange={handleChange} required/><br/> */}
                2、入库商品编号：
                <input type="text" name="productId" value={formDataYes.productId} onChange={handleChange} required /> <br/>
                3、入库商品类型：
                <input type="text" name="productType" value={formDataYes.productType} onChange={handleChange} required /><br />
                4、入库商品数量：
                <input type="number" name="productQuantity" value={formDataYes.productQuantity} onChange={handleChange} required /><br />
                5、入库商品数量单位：
                <input type="text" name="productUnit" value={formDataYes.productUnit} onChange={handleChange} required /><br />
                6、入库商品描述：
                <textarea name="productDescription" value={formDataYes.productDescription} onChange={handleChange} required/><br />
                7、入库商品生产公司：
                <input type="text" name="productionCompany" value={formDataYes.productionCompany} onChange={handleChange} required /><br />
                8、采购负责人编号：
                <input type="text" name="purchaserId" value={formDataYes.purchaserId} onChange={handleChange} required /><br />
                9、采购负责人姓名：
                <input type="text" name="purchaserName" value={formDataYes.purchaserName} onChange={handleChange} required /><br />
                10、供应商编号：
                <input type="text" name="supplierId" value={formDataYes.supplierId} onChange={handleChange} required /><br />
                11、供应商名称：
                <input type="text" name="supplierName" value={formDataYes.supplierName} onChange={handleChange} required /><br />
                12、入库商品单价：
                <input type="text" name="productPrice" value={formDataYes.productPrice} onChange={handleChange} required /><br />
                13、价格变动理由：
                <textarea name="priceChangeReason" value={formDataYes.priceChangeReason} onChange={handleChange} placeholder='若价格未变动，则无需填写' /><br />
                14、选择该商品的理由：
                <textarea name="reasonForSelection" value={formDataYes.reasonForSelection} onChange={handleChange} required /><br />
                15、申报日期时间即提交时间
                <br/>{formattedDate}
                </>
            )}

            <input type="submit" value="提交" />
        </form>
    );
}
