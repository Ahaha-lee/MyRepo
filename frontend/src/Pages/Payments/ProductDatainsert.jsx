import { useState } from "react";
import { ProductinfoSelect } from "./ProductSelect";
import { ProductinfoDelete } from "./ProductDelete";
import { ProductDataUpdate } from "./ProductUpdate";

export function ProductOperationList() {
    const [activeComponent, setActiveComponent] = useState(null);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'insert':
                return <Productinfoinsert/>;
            case 'select':
                return <ProductinfoSelect />;
            case 'delete':
                return <ProductinfoDelete />;
            case 'update':
                return <ProductDataUpdate />;
            default:
                return null;
        }
    };

    return (
        <>
            <button onClick={() => setActiveComponent('insert')}>商品信息添加</button>
            <br />
            <button onClick={() => setActiveComponent('select')}>商品信息查询</button>
            <br />
            <button onClick={() => setActiveComponent('delete')}>商品信息删除</button>
            <br />
            <button onClick={() => setActiveComponent('update')}>商品信息更改</button>
            <br />
            <div>
                {renderComponent()}
            </div>
        </>
    );
}
export function Productinfoinsert(){
    const [unit,setUnit]=useState("")

    const [productdata,setProductdata]=useState(
        {
            PROBarcode:'',   
            Category :'',
            ProductName :'',
            CostPrice :0.00,
            RetailPrice :0.00,
            DetailedlyDesc :'',
            PROLocation:'',
        }
    )

    const [inventorydata,setInventorydata]=useState({
        INVBarcode:'',
        INVProductName :'',
        Category :'',
        StockQuantity :0.00,
        StockUnit:unit,
        CumulativeInbound :0.00,
        OutboundQuantity :0.00,
        INVLocation :'待定',
        MinQuantity:0.00,
})
    const handleChange = (event) => {
        setProductdata(prevData => ({
          ...prevData,
          [event.target.name]: event.target.value
        }));
      };

      const handleSubmit = async (event) => {
        event.preventDefault();
    
        productdata.CostPrice = parseFloat(productdata.CostPrice);
        productdata.RetailPrice = parseFloat(productdata.RetailPrice);

        const updatedInventoryData = {
            ...inventorydata,
            StockUnit:unit,

            INVBarcode: productdata.PROBarcode,
            INVProductName: productdata.ProductName,
            Category: productdata.Category,
        };

        const tablename = "productsdata";
        const tablename1 = "inventorydata";
    
        try {
         
            const response1 = await fetch(`/api/tableinfoinsert?tablename=${tablename}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productdata),
            });
            console.log(JSON.stringify(productdata))
            if (!response1.ok) {
                throw new Error('插入第一个表数据失败');
            }
            console.log(updatedInventoryData)
            const response2 = await fetch(`/api/tableinfoinsert?tablename=${tablename1}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedInventoryData), 
            });
            console.log(JSON.stringify(updatedInventoryData))
    
            if (!response2.ok) {
                throw new Error('插入第二个表数据失败');
            }
    
            alert("商品信息录入成功");
        } catch (error) {
            alert(error.message); // 显示错误信息
        }
    };
    
    return(
        <div>
            <form onSubmit={handleSubmit}>
                <div>新商品入库信息填写</div>
                商品条码：
                <input type='text' name="PROBarcode"   value={productdata.PROBarcode} onChange={handleChange}  /><br />
                商品类型：
                <input type='text' name="Category"     value={productdata.Category} onChange={handleChange}  /><br />
                商品名称：
                <input type='text' name="ProductName"  value={productdata.ProductName} onChange={handleChange}  /><br />
                商品数量单位：
                <input type='text'  value={unit} onChange={(e)=>setUnit(e.target.value)}  /><br />
                商品成本价：
                <input type='number' name="CostPrice"  value={productdata.CostPrice} onChange={handleChange}  /><br />
                商品零售价：
                <input type='number' name="RetailPrice"value={productdata.RetailPrice} onChange={handleChange}  /><br />
                商品描述：
                <input type='text' name="DetailedlyDesc"  value={productdata.DetailedlyDesc} onChange={handleChange} /><br />
                商品货架位置：
                <input type='text' name="PROLocation" value={productdata.PROLocation} onChange={handleChange}  /><br />    
                <button type="submit">提交</button>                              
            </form>
        </div>
    );
}