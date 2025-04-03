import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../../../utils/MainLayOut/MainLayout';
import { InventoryApi } from '../../../api/storage/inventory';

export function InventoryUpdatePage(){
    const location = useLocation();
    const { product } = location.state || {}; 

    if (!product) {
        return <div>没有找到需要修改的产品信息</div>;
    }
    return(
        <div>
            <MainLayout rightContent={<InventoryUpdateForm inventoryinfo={product}/>} />
        </div>
    )
}

export function InventoryUpdateForm({inventoryinfo}){
    console.log(inventoryinfo)
    const [formdata, setFormData] = useState({
        Inv_barcode      :"",
        Inv_productname  :"",
        Category         :"",
        Inv_unit         :"",
        Stockall_quantity :"",
        Stocknow_quantity :"",
        Stockout_quantity :"",
        Inv_location     :"",
        Stock_minquantity :"",
        Inv_status       :"",
        ImagePath       :""
    });
  
    useEffect(() => {
        if (inventoryinfo) {
            setFormData({
                Inv_barcode: inventoryinfo.Inv_barcode,
                Inv_productname: inventoryinfo.Inv_productname,
                Category: inventoryinfo.Category,
                Inv_unit: inventoryinfo.Inv_unit,
                Stockall_quantity :inventoryinfo.Stockall_quantity,
                Stocknow_quantity :inventoryinfo.Stocknow_quantity,
                Stockout_quantity :inventoryinfo.Stockout_quantity,
                Inv_location: inventoryinfo.Inv_location,
                Stock_minquantity :inventoryinfo.Stock_minquantity,
                Inv_status:inventoryinfo.Inv_status,   
                ImagePath:inventoryinfo.ImagePath, 
            });
        }
    }, [inventoryinfo]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();


        formdata.Stockall_quantity=parseFloat(formdata.Stockall_quantity)
        formdata.Stocknow_quantity=parseFloat(formdata.Stocknow_quantity)
        formdata.Stockout_quantity=parseFloat(formdata.Stockout_quantity)
        formdata.Stock_minquantity=parseFloat(formdata.Stock_minquantity)
        const totalquantities = formdata.Stocknow_quantity + formdata.Stockout_quantity;

        if (totalquantities !== formdata.Stockall_quantity) {
            alert("现有库存数量和出库库存数量之和不等于库存总数量不相等，请检查输入")
            return 
        }
  
        try {
            if (inventoryinfo) {
                // 修改商品信息
                const res = await InventoryApi.updateinfo(
                    {
                        params:{update_id:inventoryinfo.Inventory_id},
                        data:formdata
                    }
                );
            console.log("修改商品库存信息成功", res);
            }
        }catch (err) {
            console.log("操作失败", err)
        }
    };

 return(
    <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh', width: '100%', minWidth: '400px' }}>
            <form onSubmit={handleSubmit} style={{ width: '60%' }}>
                <h2 className="text-center">修改商品库存信息</h2>
                <div className="container">
                 <div className="col-md-12">
                    <label>商品名称:</label>
                    <input
                        className="form-control"
                        type="text"
                        value={formdata.Inv_productname}
                        name="Inv_productname"
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-12">
                    <label>商品条码:</label>
                    <input
                        className="form-control"
                        type="text"
                        value={formdata.Inv_barcode}
                        name="Inv_barcode"
                        readOnly
                    />
                </div>
                <div className="col-md-12">
                    <label htmlFor="ImagePath" className="form-label">商品图片(不可修改，如需修改请前往商品信息管理处修改):</label>
                    {formdata.ImagePath && (
                        <div className="mb-3">
                            <img src={`http://localhost:3001/${formdata.ImagePath}`} alt="Product" style={{ width: '50%', height: '100px' }} />
                        </div>
                    )}
                </div>
                <div className="col-md-12">
                    <label>商品种类:</label>
                    <input
                        className="form-control"
                        type="text"
                        value={formdata.Category}
                        name="Category"
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-12">
                    <label>商品数量单位:</label>
                    <input
                        className="form-control"
                        type="text"
                        value={formdata.Inv_unit}
                        name="Inv_unit"
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-12">
                    <label>库存总数量:</label>
                    <input
                        className="form-control"
                        type="text"
                        value={formdata.Stockall_quantity}
                        name="Stockall_quantity"
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-12">
                    <label>库存现有数量:</label>
                    <input
                        className="form-control"
                        type="text"
                        value={formdata.Stocknow_quantity}
                        name="Stocknow_quantity"
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-12">
                    <label>库存出库数量:</label>
                    <input
                        className="form-control"
                        type="text"
                        value={formdata.Stockout_quantity}
                        name="Stockout_quantity"
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-12">
                    <label>商品库存最小数量:</label>
                    <input
                        className="form-control"
                        type="text"
                        value={formdata.Stock_minquantity}
                        name="Stock_minquantity"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>商品库存状态:</label>
                    <input
                        className="form-control"
                        type="text"
                        value={formdata.Inv_status}
                        name="Inv_status"
                        onChange={handleChange}
                    />
                </div>
                <button className="btn btn-primary" >提交</button>
            </div>
            </form>
            
        </div>
    );
}