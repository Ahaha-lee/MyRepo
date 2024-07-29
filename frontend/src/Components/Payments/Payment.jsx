import React, { useContext, useState } from "react";
import {useNavigate} from 'react-router-dom';
import useSession from "../../useSession";
import { useEffect } from 'react';

// 欠账任务：
//账单商品删除，账单条例直接删除，总价或者和账单一起回到上一个状态（跟井字棋游戏的保存上一个状态一样？但是井字棋怎么做的？）还是建立一个减法函数
//称重？折扣怎么处理？
function Payment() {

    const navigate = useNavigate();
    const { getSession } = useSession();
    const user = getSession();

    useEffect(() => {
        if (!user) {
            navigate("/login")
        }
    }, [user])

    //假设商品条形码扫码以后转换为codenumeber
    const products = [
        {id: 1, name: '苹果', price: 1.00, codenumeber:'12345'},
        {id: 2, name: '橙子', price: 0.50, codenumeber:'22345'},
        {id: 3, name: '梨子', price: 1.00, codenumeber:'32345' },
        {id: 4, name: '西瓜', price: 2.00, codenumeber:'42345' },
        {id: 5, name: '玫瑰', price: 1.50, codenumeber:'52345'}
     ];

    const [searchTerm,setsearchTerm]=useState('');//存储搜索输入框的输入值
    const [searchResults, setsearchResults] = useState([]);//搜索输入后的结果
    const [quantities, setQuantities] = useState({}); // 搜索后填写的数量（存储输入框的值）

    //搜索查询商品 点击按钮'搜索'以后，调用handleSearch()函数
    const handleProductsSearch = () => {
        const results = products.filter(p => p.name.includes(searchTerm)||p.codenumeber.includes(searchTerm));
        setsearchResults(results);
    };
    // 创建一个处理函数来更新输入框的值
    const handleQuantityChange = (id, value) => {
        setQuantities(prevQuantities => ({ ...prevQuantities, [id]: value }));
    };
    const [chill,setchill]=useState([])//chill购买物品的账单（数组）
    const [itemIndex, setItemIndex] = useState(0);//为chill数组建立索引
    
    function addToChill(productId, quantity = 1) {
        setchill(prevChill => [...prevChill, { id: productId, quantity }]);
    }

    //假设账单如下
    const newItems=[
        {id:1,quantity:2},
        {id:5,quantity:4},
    ];

    function handlePayToButtonClick() {
        if (itemIndex < newItems.length) {
            addToChill(newItems[itemIndex].id, newItems[itemIndex].quantity);
            setItemIndex(itemIndex + 1);
        }
        else{
            alert("商品已全部结算完毕")
        }
    }
    //'添加到账单'按钮调用函数
    function calculateTotal() {
        let total=0;
        for(let item of chill) {
            const product = products.find(p => p.id === item.id);
            if (product) {
                total += product.price * item.quantity;
            }
        }
        return total;
    } 

    return (
        <div>
            <h1>收银</h1>
            <div>
            <input type="text" placeholder="Search"  value={searchTerm} onChange={e=>setsearchTerm(e.target.value)}/>
            <button onClick={handleProductsSearch}>搜索</button>
            <ul>
               {searchResults.map(item => (
                 <li key={item.id}>
                 {item.name}
                 {/* 搜索框里面的商品数量的 */}
                 {/* 在渲染输入框时，将其值设置为对应的状态，并在其值改变时调用处理函数 */}
                <input type="number" min="1" value={quantities[item.id] || ''} onChange={e => handleQuantityChange(item.id, e.target.value)} />
                {/* 在添加到购物车时，使用状态中的值（直接查询dom?document什么的)*/}
                <button onClick={() => addToChill(item.id, quantities[item.id] || 1)}>添加到chill</button>
                 </li>
                ))}
            </ul>

           </div>
            <button onClick={handlePayToButtonClick}>账单输出</button>
            {/* 表单输出 */}
            <table>
                <thead>
                    <tr>
                       <th>编号</th> 
                       <th>名称</th>
                       <th>单价</th>
                       <th>数量</th>            
                       <th>总价</th>            
                    </tr>
                </thead>
                <tbody>
                 {chill.map((item, index) => {
                 const product = products.find(p => p.id === item.id);
                 return product ? (
                   <tr key={product.id}>
                       <td>{product.id}</td>
                       <td>{product.name}</td>
                       <td>{product.price}</td>
                       <td>{item.quantity}</td>
                       <td>{item.quantity*product.price}</td>
                   </tr>
                ) : (
                    <tr key={index}>
                        <td colSpan={5}>找不到产品 ID {item.id}</td>
                    </tr>
                );
                })}
                </tbody>
            </table>
            <div>总价: {calculateTotal().toFixed(2)}</div>
        </div>
    );
}
export default Payment;
