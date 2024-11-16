import React, { useState } from 'react';
import { Handleselect } from '../Payments/ProductSelect';

export const InventoryDataUpdate = () => {
    const [barcode, setBarcode] = useState("");
    // 初始化表格数据
    const [data, setData] = useState([]);

    // 处理单元格值变化
    const handleChange = (rowIndex, columnKey, value) => {
        const newData = [...data];
        newData[rowIndex][columnKey] = value;
        setData(newData);
    };
    console.log(data)

    // 处理查询结果
    const handleResult = (result) => {
        const formattedData = {
            inventoryID: result.inventoryID,
            ...result.inventoryStruct, // 将 inventoryStruct 的属性展开到新对象中
        };
        setData([formattedData]); 
    };
    const handleSubmit = async () => {
        const reqdata = {  
            CumulativeInbound: Number(data[0].CumulativeInbound), 
            INVLocation: data[0].INVLocation, 
            MinQuantity: Number(data[0].MinQuantity), 
            OutboundQuantity: Number(data[0].OutboundQuantity), 
            StockQuantity: Number(data[0].StockQuantity) 
        };
        
        console.log(reqdata)
        try {
            const response = await fetch(`/api/updateproductinfo?tablename=${'inventorydata'}&&id=${barcode}&&keyword=${"INVBarcode"}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                 reqdata
                 ),
                
            });
            console.log(JSON.stringify(
               reqdata
             ))
             if (!response.ok) {
                throw new Error('更新数据失败');
            }
            alert("更新成功");
            } catch (err) {
                alert(err.message)
            }
    }
    const nonEditableColumns = ['inventoryID', 'INVProductName', 'INVBarcode', 'Category', 'StockUnit'];

    return (
        <>
        <div>
            更改库存商品信息查询：
            <input
                type="text"
                value={barcode}
                onChange={(event) => setBarcode(event.target.value)}
            />
            <Handleselect barcode={barcode} setResult={handleResult} tablename={"inventorydata"} />
            <br /><br/>
        </div>
        库存商品信息：
            <table border="1">
                <thead>
                    <tr>
                        <th>库存商品ID</th>
                        <th>库存商品名称</th>
                        <th>库存商品条码</th>
                        <th>库存商品类型</th>
                        <th>商品数量单位</th>
                        <th>库存商品现有数量</th>
                        <th>库存商品总数量</th>
                        <th>库存商品出库数量</th>
                        <th>商品库存最小数量</th>
                        <th>商品库存位置</th>
                    </tr>
                </thead>
                <tbody>
                {data.map((row, rowIndex) => (
                        <tr key={row.inventoryID}>
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
            <button onClick={handleSubmit}>提交更改</button>
        </>
    );
};
