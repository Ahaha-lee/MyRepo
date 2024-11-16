import { useState } from "react";

export function ProInfoShow({ productdata }) {
    return (
        <>
            <strong>商品编号：{productdata.productID}</strong><br />
            <strong>商品条码：{productdata.productInsertStruct.pROBarcode}</strong><br />
            <strong>商品类型：{productdata.productInsertStruct.category}</strong><br />
            <strong>商品名称：{productdata.productInsertStruct.productName}</strong><br />
            <strong>商品成本价：{productdata.productInsertStruct.costPrice}</strong><br />
            <strong>商品零售价：{productdata.productInsertStruct.retailPrice}</strong><br />
            <strong>商品描述：{productdata.productInsertStruct.detailedlyDesc}</strong><br />
            <strong>商品位置：{productdata.productInsertStruct.pROLocation}</strong><br />
        </>
    );
}
export function Handleselect({ barcode, setResult,tablename }) {
    const handleSelect = async () => {
        // 构建查询参数
        const params = new URLSearchParams({
            recordid: barcode,
            tablename: tablename
        });

        try {
            const response = await fetch(`/api/gettableinfo?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert(`查询数据失败: ${errorText}`);
                return;
            }

            const data = await response.json();
            setResult(data); // 设置查询结果
            console.log('查询结果:', data);

        } catch (error) {
            alert('网络错误，请稍后再试');
            console.error('Error:', error);
        }
    };

    return (
        <button onClick={handleSelect}>查询</button>
    );
}
export function ProductinfoSelect({ onSendData }) {
    const [barcode, setBarcode] = useState("");
    const [result, setResult] = useState(null); // 初始化为 null

    return (
        <>
            商品信息查询：
            <input
                type="text"
                value={barcode}
                onChange={(event) => setBarcode(event.target.value)}
            />
            <Handleselect barcode={barcode} setResult={setResult} tablename={"productsdata"}/><br/>
            {result && <ProInfoShow productdata={result} />}
        </>
    );
}
