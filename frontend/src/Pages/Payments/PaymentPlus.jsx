import React, { useEffect, useState } from 'react';
import useSession from '../../useSession';
import { CashModel } from './SettleeAccount';
import { GetDiscountedPrice} from './PaymentAddtoCart';

export function PaymentPuls() {
  const [barcode, setBarcode] = useState("");
  const [shoppingcar, setShoppingcar] = useState([]); // 购物车信息
  const [results, setResults] = useState(null); // 查询结果
  const [number, setNumber] = useState(1);//购买数量
  const [sorecorsid,setSOrecordid]=useState("") //订单记录ID
  const [purchaserid,setPurchaseid]=useState("")
  const [purchaseorder,setPurchareorder]=useState([])
  const [price, setPrice] = useState(null);
  const {getSession}  = useSession();
  const handler =getSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(()=>{
    const GetCount=async()=>{
      try {
        const response= await fetch(`/api/gettablecount?tablename=salesorder`, {
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
        const data =await response.json()
        setSOrecordid(`SO${data + 1}`);
        setPurchaseid(`PO${data + 1}`);
  
      } catch (error) {
        alert('网络错误，请稍后再试');
        console.error('Error:', error);
      }
    }
    GetCount();
  },[])
  console.log(sorecorsid)
  console.log(purchaserid)


  
//商品信息查询
  async function handleSelect() {
    const params = new URLSearchParams({
      recordid: barcode,
      tablename: "productsdata"
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
      setResults(data); // 设置解码后的结果
      console.log('查询结果:', data);

    } catch (error) {
      alert('网络错误，请稍后再试');
      console.error('Error:', error);
    }
  }    

//添加到购物车
const addToCart = async (product) => {
  const discountedPrice = await GetDiscountedPrice(product.pROBarcode); // 获取折扣价格的函数
  const finalPrice = discountedPrice[0] // 如果有折扣，使用折扣价格，否则使用原价

  const productWithQuantity = { 
      ...product, 
      retailPrice: finalPrice, // 使用最终价格
      quantity: number,
  }; 

  setShoppingcar([...shoppingcar, productWithQuantity]);
};

// 删除购物车
  const deleteCartProduct = (index) => {
    const updatedCart = shoppingcar.filter((_, i) => i !== index); // 过滤掉要删除的商品
    setShoppingcar(updatedCart); 
  };


// 订单记录中的下级购买商品表
  const updatePurchaseOrder = () => {
    const newPurchaseOrders = []; // 创建一个新数组来存储新的订单数据

    for (let i = 0; i < shoppingcar.length; i++) {
        const purchaseorderdata = {
            PurchaseID: purchaserid,
            PurchaseproBarcode: shoppingcar[i].pROBarcode,
            PurchaseproName: shoppingcar[i].productName,
            PurchaseproRetailPrice: shoppingcar[i].retailPrice,
            PurchaseproQuantities: shoppingcar[i].quantity,
            ProductUnit: "待定",
        };
        console.log(purchaseorderdata);
        newPurchaseOrders.push(purchaseorderdata); // 将新的订单数据推入数组
    }

    setPurchareorder((prev) => [...(prev||[]), ...newPurchaseOrders]);
};

  const openModal = () => {
    setIsModalOpen(true);
    updatePurchaseOrder();
  };
  console.log(purchaseorder)

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleKeyDown = (event, product) => {
    if (event.key === 'Enter') {
      addToCart(product);
    }
  };
  const handleDeleteKeyDown = (event, index) => {
    if (event.key === 'Enter') {
      deleteCartProduct(index);
    }
  };
  
  // const CalculateTotalPrice=()=>{
  //   const totalPrice = shoppingcar.reduce((total, item) => {
  //     return total + item.retailPrice * item.quantity;
  //   }, 0);
  //   const DiscountRate=GetDiscountedPrice()
  // }
  const totalPrice = shoppingcar.reduce((total, item) => {
    return total + item.retailPrice * item.quantity;
  }, 0);
  
// 交易完成以后订单数据提交给后台
  console.log(shoppingcar)
  const handleOrder=async (vipdata)=>{
    console.log(vipdata)
    try{
      const values=({
        SaleRecordID:sorecorsid,
        CustomerID :vipdata.vipphone,
        PurchaseTableID:purchaserid, 
        CashierID :handler.EmployeeID
      })
    
      const response= await fetch(`/api/tableinfoinsert?tablename=salesorder`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      console.log(values)

      if (!response.ok) {
        throw new Error('插入数据失败');
      }
      alert('销售订单录入成功')

      const values2={
        "type": "purchases",
        "purchases": purchaseorder
    }
    
      
    const response1= await fetch(`/api/arrayinsert`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values2),
    });
    console.log(JSON.stringify(values2))

    if (!response1.ok) {
      throw new Error('插入数据失败');
    }
    alert('购物商品信息录入成功') 

  } catch (error) {
    alert('网络错误，请稍后再试');
    console.error('Error:', error);
  }

 }

  return (
    <div>
      商品查询：
      <input
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="输入条形码"
      />
      <button onClick={handleSelect}>查询</button>&nbsp;
     
      {results && (
        <div>
          <ul>
            <li key={results.productID} tabIndex={0} onKeyDown={(event) => handleKeyDown(event, results.productInsertStruct)}>
              商品名称：{results.productInsertStruct.productName}&nbsp;&nbsp;商品售价：{results.productInsertStruct.retailPrice}元
              &nbsp;&nbsp;数量：<input type="number" value={number} min="1" 
                                       onChange={(event) => setNumber(Number(event.target.value))}/>
              <button onClick={() => addToCart(results.productInsertStruct)}>添加到购物车</button>
            </li>
          </ul>
        </div>
      )}

      <h2>购物车</h2>
      {shoppingcar.length === 0 ? (
        <p>购物车为空。</p>
      ) : (
        <ul>
           <li>
            <strong>编号</strong>|<strong>商品名称</strong> | <strong>商品售价</strong> | <strong>商品数量</strong> | <strong>商品总价</strong>|<strong>操作</strong>
          </li>
          {shoppingcar.map((item, index) => (
            <li key={index} tabIndex={0} onKeyDown={(event) => handleDeleteKeyDown(event, index)}>
              {index + 1} | {item.productName} | {item.retailPrice}元 | {item.quantity} | {item.retailPrice * item.quantity}元|&nbsp;&nbsp;
              <button onClick={() => deleteCartProduct(index)}>删除</button>&nbsp;
              <button>更改</button>
            </li>
            ))}
          </ul>
      )}
      <div>
      <h3>总价：{totalPrice}</h3>
      <button onClick={openModal}>订单结算</button>
      {isModalOpen && <CashModel isOpen={isModalOpen} 
                                 onClose={closeModal} 
                                 totalprice={totalPrice}
                                 onSubmit={handleOrder}/>}
      </div>
    </div>
  );
}
