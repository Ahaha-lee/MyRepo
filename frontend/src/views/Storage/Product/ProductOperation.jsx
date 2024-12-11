import { useState,useEffect } from "react";
import MainLayout from "../../../utils/MainLayOut/MainLayout";
import { ProductApi } from "../../../api/storage/product";
import { useLocation } from 'react-router-dom';

export function ProductAddPage() {
    return(
        <div>
            <MainLayout rightContent={<ProductAddUpdateForm/>} />
        </div>
    )
}
export function ProductUpdatePage() {
    const location = useLocation();
    const { product } = location.state || {}; // 获取传递的产品信息

    if (!product) {
        return <div>没有找到需要修改的产品信息</div>;
    }

    return(
        <div>
            <MainLayout rightContent={<ProductAddUpdateForm productinfo={product}/>} />
        </div>
    )
}


export function ProductAddUpdateForm({productinfo}) {

    const [formdata, setFormData] = useState({
        ProBarcode: "",
        Category: "",
        ProductName: "",
        CostPrice: 0,
        RetailPrice: 0,
        ProductUnit: "",
        DetailedlyDesc: "",
        ProLocation: "",
    });

    useEffect(() => {
        if (productinfo) {
            setFormData({
                ProBarcode: productinfo.ProBarcode,
                Category: productinfo.Category,
                ProductName:productinfo.ProductName,
                CostPrice:productinfo.CostPrice,
                RetailPrice: productinfo.RetailPrice,
                ProductUnit: productinfo.ProductUnit,
                DetailedlyDesc: productinfo.DetailedlyDesc,
                ProLocation: productinfo.ProLocation,
            });
        }
    }, [productinfo]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        formdata.CostPrice = parseFloat(formdata.CostPrice);
        formdata.RetailPrice = parseFloat(formdata.RetailPrice);

        try {
            if (productinfo) {
                // 修改商品信息
                const res = await ProductApi.updateinfo(
                    {
                        params:{update_id:productinfo.ProductID},
                        data:formdata
                    }
                );
                console.log("修改商品成功", res);
            } else {
                // 添加新商品
                const res = await ProductApi.addinfo(formdata);
                console.log("添加商品成功", res);
            }
        } catch (err) {
            console.log("操作失败", err);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh', width: '100%', minWidth: '400px' }}>
            <form onSubmit={handleSubmit} style={{ width: '60%' }}>
                <h2 className="text-center">{productinfo ? "修改商品" : "新增商品"}</h2>
                <div className="col-md-12">
                    <label>商品名称:</label>
                    <input
                        className="form-control"
                        type="text"
                        value={formdata.ProductName}
                        name="ProductName"
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-12">
                    <label>商品条码:</label>
                    <input
                        className="form-control"
                        type="text"
                        value={formdata.ProBarcode}
                        name="ProBarcode"
                        onChange={handleChange}
                        readOnly
                    />
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
                        value={formdata.ProductUnit}
                        name="ProductUnit"
                        onChange={handleChange}
                    />
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <label>商品成本价:</label>
                        <input
                            className="form-control"
                            type="number"
                            value={formdata.CostPrice}
                            name="CostPrice"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label>商品零售价:</label>
                        <input
                            className="form-control"
                            type="number"
                            value={formdata.RetailPrice}
                            name="RetailPrice"
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="col-md-12">
                    <label>货架位置:</label>
                    <input
                        className="form-control"
                        type="text"
                        value={formdata.ProLocation}
                        name="ProLocation"
                        onChange={handleChange}
                    />
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <label>商品详情:</label>
                        <textarea
                            className="form-control"
                            value={formdata.DetailedlyDesc}
                            name="DetailedlyDesc"
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <button className="btn btn-primary">提交</button>
            </form>
            
        </div>
    );
}
