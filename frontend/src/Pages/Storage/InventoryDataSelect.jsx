import { useState } from "react";
import { Handleselect } from "../Payments/ProductSelect";
import { InventoryDataUpdate } from "./InventoryUpdate";

export function InventorytOperationList() {
    const [activeComponent, setActiveComponent] = useState(null);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'select':
                return <InventoryinfoSelect />;
            case 'update':
                return <InventoryDataUpdate />;
            default:
                return null;
        }
    };

    return (
        <>
            <button onClick={() => setActiveComponent('select')}>库存信息查询</button>
            <br />
            <button onClick={() => setActiveComponent('update')}>库存信息更改</button>
            <br />
            <div>
                {renderComponent()}
            </div>
        </>
    );
}


export function InventoryInfoShow({ inventorydata }) {
    return (
        <>
        <strong>库存商品ID：{inventorydata.inventoryID}</strong><br/>
        <strong>库存商品名称：{inventorydata.inventoryStruct.INVProductName}</strong><br/>
        <strong>库存商品条码：{inventorydata.inventoryStruct.INVBarcode}</strong> <br/>
        <strong>库存商品类型：{inventorydata.inventoryStruct.Category}</strong><br/>
        <strong>商品数量单位： {inventorydata.inventoryStruct.StockUnit}</strong><br/>
        <strong>库存商品总数量：{inventorydata.inventoryStruct.CumulativeInbound}</strong><br/>
        <strong>库存商品现有数量：{inventorydata.inventoryStruct.StockQuantity}</strong> <br/>
        <strong>库存商品出库数量：{inventorydata.inventoryStruct.OutboundQuantity}</strong><br/>
        <strong>商品库存最小数量：{inventorydata.inventoryStruct.MinQuantity}</strong><br/>        
        <strong>商品库存位置：{inventorydata.inventoryStruct.INVLocation}</strong><br/>           
        </>
    );
}

export function InventoryinfoSelect({onSendData}) {
    const [barcode, setBarcode] = useState("");
    const [result, setResult] = useState(null); // 初始化为 null

    console.log("selectResult",result)

    return (
        <>
            库存商品信息查询：
            <input
                type="text"
                value={barcode}
                onChange={(event) => setBarcode(event.target.value)}
            />
            <Handleselect barcode={barcode} setResult={setResult} tablename={"inventorydata"}/><br/>
            {result && <InventoryInfoShow inventorydata={result}/> }
        </>
    );
}
