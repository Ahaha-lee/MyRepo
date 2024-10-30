import React, { useState } from 'react';
import { Handleselect } from '../Payments/ProductSelect';

export const ProductDataUpdate = () => {
    const [barcode, setBarcode] = useState("");
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    const handleChange = (rowIndex, columnKey, value) => {
        const newData = [...data];
        newData[rowIndex][columnKey] = value;
        setData(newData);
    };

    const handleResult = (result) => {
        const formattedData = {
            productID: result.productID,
            ...result.productInsertStruct,
        };
        setData([formattedData]);
    };

    const handleSubmit = async () => {
        if (data.length === 0) {
            alert("请先查询商品信息");
            return;
        }

        const reqdata = {
            costPrice: Number(data[0].costPrice),
            retailPrice: Number(data[0].retailPrice),
            pROLocation: data[0].pROLocation,
            detailedlyDesc: data[0].detailedlyDesc,
        };

        setError(null);

        try {
            const response = await fetch(`/api/updateproductinfo?tablename=productsdata&id=${barcode}&keyword=PROBarcode`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqdata),
            });

            if (!response.ok) {
                throw new Error('更新数据失败');
            }

            // Clear input and data after successful submission
            setBarcode("");
            setData([]);
            alert("更新成功");
        } catch (err) {
            setError(err.message);
        } 
    };

    const nonEditableColumns = ['productID', 'productName', 'pROBarcode', 'category'];

    return (
        <>
            <div>
                更改商品信息查询：
                <input
                    type="text"
                    value={barcode}
                    onChange={(event) => setBarcode(event.target.value)}
                />
                <Handleselect barcode={barcode} setResult={handleResult} tablename={"productsdata"} />
                <br /><br />
            </div>
            商品信息：
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <table border="1">
                <thead>
                    <tr>
                        <th>商品ID</th>
                        <th>商品条码</th>
                        <th>商品类型</th>
                        <th>商品名称</th>
                        <th>商品成本价</th>
                        <th>商品零售价</th>
                        <th>商品详情</th>
                        <th>库存货架位置</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={row.inventoryID}>
   {console.log(row)}
                            {Object.keys(row).map((key) => (
                                <td key={key}
                                    contentEditable={!nonEditableColumns.includes(key)}
                                    suppressContentEditableWarning={true}
                                    onBlur={(e) => {
                                        if (!nonEditableColumns.includes(key)) {
                                            handleChange(rowIndex, key, e.target.innerText);
                                        }
                                    }}
                                >
                                    {row[key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleSubmit}>提交更改
            </button>
        </>
    );
};
