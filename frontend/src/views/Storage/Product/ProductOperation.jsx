import { useState, useEffect } from "react";
import MainLayout from "../../../utils/MainLayOut/MainLayout";
import { ProductApi, ProductCacheApi } from "../../../api/storage/product";
import { useLocation } from 'react-router-dom';
import React from 'react';
import { CommonTable } from "../../../utils/Common/CommonTable";
import 'react-data-grid/lib/styles.css';
import ReactDataGrid from 'react-data-grid';

export function ProductAddPage() {
    const location = useLocation();
    const { categoryinfo } = location.state || {}; 

    if (!categoryinfo) {
        return <div>没有找到需要种类信息</div>;
    }

    return (
        <div>
            <MainLayout rightContent={<ProductAddUpdateForm categoryinfo={categoryinfo}/>} />
        </div>
    );
}

export function ProductUpdatePage() {
    const location = useLocation();
    const { product } = location.state || {}; // 获取传递的产品信息

    if (!product) {
        return <div>没有找到需要修改的产品信息</div>;
    }

    return (
        <div>
            <MainLayout rightContent={<ProductAddUpdateForm productinfo={product}/>} />
        </div>
    );
}

export function ProductAddUpdateForm({ productinfo, categoryinfo }) {
    console.log("ProductAddUpdateForm", productinfo);
    const [formdata, setFormData] = useState([{
        ProBarcode: "",
        Category: "",
        ProductName: "",
        CostPrice: parseFloat(0),
        RetailPrice: 0,
        ProductUnit: "",
        DetailedlyDesc: "",
        ProLocation: "",
        ImagePath: "", // 添加图片路径字段
    }]);

    useEffect(() => {
        if (productinfo) {
            setFormData([{
                ProBarcode: productinfo.ProBarcode || "",
                Category: productinfo.Category || "",
                ProductName: productinfo.ProductName || "",
                CostPrice: productinfo.CostPrice || 0,
                RetailPrice: productinfo.RetailPrice || 0,
                ProductUnit: productinfo.ProductUnit || "",
                DetailedlyDesc: productinfo.DetailedlyDesc || "",
                ProLocation: productinfo.ProLocation || "",
                ImagePath: productinfo.ImagePath || "", // 设置图片路径
            }]);
        }
    }, [productinfo]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => {
            const updatedItem = { ...prevData[0] };
            if (name === "CostPrice" || name === "RetailPrice") {
                const parsedValue = isNaN(Number(value)) ? updatedItem[name] : Number(value);
                updatedItem[name] = parsedValue;
            } else {
                updatedItem[name] = value === "" ? updatedItem[name] : value;
            }
            return [updatedItem];
        });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imagePath = `images/${file.name}`; 
            setFormData(prevData => {
                const updatedItem = { ...prevData[0], ImagePath: imagePath };
                return [updatedItem];
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (productinfo) {
                // 修改商品信息
                const res = await ProductApi.updateinfo({
                    params: { update_id: productinfo.ProductID },
                    data: formdata[0]
                });
                console.log("修改商品成功", res);
            } else {
                // 添加新商品
                const res = await ProductApi.addinfo(formdata);
                console.log("添加商品成功", res);
            }
        } catch (err) {
            console.error("操作失败", err);
        }
    };
    console.log("formdata", formdata[0]);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh', width: '100%', minWidth: '400px' }}>
            <form onSubmit={handleSubmit} style={{ width: '60%' }}>
                <h2 className="text-center">{productinfo ? "修改商品" : "新增商品"}</h2>
                <div className="col-md-12">
                    <label>商品名称:</label>
                    <input
                        className="form-control"
                        type="text"
                        value={formdata[0].ProductName}
                        name="ProductName"
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-12">
                    <label htmlFor="ImagePath" className="form-label">商品图片:</label>
                    {formdata[0].ImagePath && (
                        <div className="mb-3">
                            <img src={`http://localhost:3001/${formdata[0].ImagePath}`} alt="Product" style={{ width: '50%', height: '100px' }} />
                        </div>
                    )}
                    <input
                        type="file"
                        className="form-control"
                        name="ImagePath"
                        id="ImagePath"
                        onChange={handleImageChange}
                    />
                </div>
                <div className="col-md-12">
                    <label>商品条码:</label>
                    <input
                        className="form-control"
                        type="text"
                        value={formdata[0].ProBarcode}
                        name="ProBarcode"
                        onChange={handleChange}
                        readOnly={!!productinfo}
                    />
                </div>
                {Array.isArray(categoryinfo) && categoryinfo.length > 0 ? (
                    <div className="col-md-12 mb-3">
                        <label htmlFor="Category" className="form-label">商品种类:</label>
                        <select id="Category" name="Category" onChange={handleChange} className="form-select">
                            <option value="">请选择商品种类</option>
                            {categoryinfo.map((category) => (
                                <option key={category.CategoryID} value={category.CategoryName}>
                                    {category.CategoryName}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className="col-md-12">
                        <label>商品种类:</label>
                        <input
                            className="form-control"
                            type="text"
                            value={formdata[0].Category}
                            name="Category"
                            onChange={handleChange}
                        />
                    </div>
                )}
                <div className="col-md-12">
                    <label>商品数量单位:</label>
                    <input
                        className="form-control"
                        type="text"
                        value={formdata[0].ProductUnit}
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
                            value={formdata[0].CostPrice}
                            name="CostPrice"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label>商品零售价:</label>
                        <input
                            className="form-control"
                            type="number"
                            value={formdata[0].RetailPrice}
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
                        value={formdata[0].ProLocation}
                        name="ProLocation"
                        onChange={handleChange}
                    />
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <label>商品详情:</label>
                        <textarea
                            className="form-control"
                            value={formdata[0].DetailedlyDesc}
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
// 批量增加商品
export function ProductBatchAddPage() {
    return (
        <div>
            <MainLayout rightContent={<EditableGrid />} />
        </div>
    );
}

const initialRows = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    ProBarcode: '',
    ProductName: '',
    Category: '',
    ProductUnit: '',
    CostPrice: '',
    RetailPrice: '',
    ProLocation: '',
    DetailedlyDesc: '',
}));

const columns = [
    { key: 'ProBarcode', name: '商品条码', editable: true },
    { key: 'ProductName', name: '商品名称', editable: true },
    { key: 'Category', name: '商品种类', editable: true },
    { key: 'ProductUnit', name: '商品数量单位', editable: true },
    { key: 'CostPrice', name: '商品成本价', editable: true },
    { key: 'RetailPrice', name: '商品零售价', editable: true },
    { key: 'ProLocation', name: '货架位置', editable: true },
    { key: 'DetailedlyDesc', name: '商品详情', editable: true },
];

const EditableGrid = () => {
    const [rows, setRows] = useState(initialRows);

    const handleRowsChange = (newRows) => {
        setRows(newRows);
    };

    const addRow = () => {
        setRows([...rows, { id: rows.length, ProBarcode: '', ProductName: '', Category: '', ProductUnit: '', CostPrice: '', RetailPrice: '', ProLocation: '', DetailedlyDesc: '' }]);
    };

    const handleSubmit = () => {
        const filteredRows = rows.filter(row => Object.values(row).some(value => value !== ''));
        console.log('提交的数据:', filteredRows);
        // 在这里可以进行数据提交的操作，例如发送到服务器
    };

    return (
        <div style={{ height: "80vh", display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
                <ReactDataGrid
                    columns={columns}
                    rows={rows}
                    onRowsChange={handleRowsChange}
                    editable
                    style={{ height: "100%" }} // 确保表格占满容器
                />
            </div>
            <div style={{ marginTop: "10px" }}>
                <button onClick={addRow}>添加行</button>
                <button onClick={handleSubmit}>提交</button>
            </div>
        </div>
    );
};

export function GetCacheProduct() {
    const [Results, setResults] = useState([]);
    const columns = [
        {
            title: '商品ID',
            key: 'ProductID'
        },
        {
            title: '商品名称',
            key: 'ProductName'
        },
        {
            title: '商品条码',
            key: 'ProBarcode'
        },
        {
            title: '商品描述',
            key: 'DetailedlyDesc'
        },
        {
            title: '商品种类',
            key: 'Category',
        }
    ];

    useEffect(() => {
        getlist();
    }, []);
    const getlist = () => {
        try {
            ProductCacheApi.getallinfo().then((res) => {
                console.log("缓存返回的数据:", res);

                if (!res) {
                    console.log("缓存为空");
                    return;
                }

                // 提取 product 信息并组成新数组
                const productsArray = res.map((item) => item.Product);

                // 设置结果
                setResults(productsArray);
            })
        } catch (error) {
            console.error('错误信息:', error);
        }
    }
    console.log("Results:", Results);

    return (
        <div>
            <div className="container">
                <CommonTable
                    columns={columns}
                    data={Results}
                    checkable={true}
                    idField={"ProductID"}
                />
            </div>
        </div>
    );
}