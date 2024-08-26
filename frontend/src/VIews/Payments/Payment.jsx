import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import useSession from "../../useSession";
import { Select } from 'antd';
import pinyin from'pinyin';
import { Receipts } from "./Receipt";

export const Paymentcontext = React.createContext({ chill: [
    { id: 1, name: '苹果', price: 1.00, quantities: 5 , diacount:0},
    { id: 2, name: '橙子', price: 0.50, quantities: 2 , diacount:0},
    { id: 4, name: '西瓜', price: 2.00, quantities: 3 , diacount:0}
    ], setChill: () => {}, 
    products: [
    { id: 1, name: '苹果', price: 1.00, codenumeber: '12345', notes: '', pinyin: pinyin('苹果', { style: pinyin.STYLE_NORMAL }).join('') },
    { id: 2, name: '橙子', price: 0.50, codenumeber: '22345', notes: '', pinyin: pinyin('橙子', { style: pinyin.STYLE_NORMAL }).join('') },
    { id: 3, name: '梨子', price: 1.00, codenumeber: '32345', notes: '', pinyin: pinyin('梨子', { style: pinyin.STYLE_NORMAL }).join('') },
    { id: 4, name: '西瓜', price: 2.00, codenumeber: '42345', notes: '', pinyin: pinyin('西瓜', { style: pinyin.STYLE_NORMAL }).join('') },
    { id: 5, name: '玫瑰', price: 1.50, codenumeber: '52345', notes: '', pinyin: pinyin('玫瑰', { style: pinyin.STYLE_NORMAL }).join('') },
    { id: 6, name: '苹果醋', price: 3.00, codenumeber: '62345', notes: '', pinyin: pinyin('苹果醋', { style: pinyin.STYLE_NORMAL }).join('') }
    ],
    cashiers: [ { employeesId: '1001', name: 'Tom' },] });
const { Option } = Select;
export default function Payment(){
    const [products,setproducts] =useState([
        { id: 1, name: '苹果', price: 1.00, codenumeber: '12345', notes: '', pinyin: pinyin('苹果', { style: pinyin.STYLE_NORMAL }).join('') },
        { id: 2, name: '橙子', price: 0.50, codenumeber: '22345', notes: '', pinyin: pinyin('橙子', { style: pinyin.STYLE_NORMAL }).join('') },
        { id: 3, name: '梨子', price: 1.00, codenumeber: '32345', notes: '', pinyin: pinyin('梨子', { style: pinyin.STYLE_NORMAL }).join('') },
        { id: 4, name: '西瓜', price: 2.00, codenumeber: '42345', notes: '', pinyin: pinyin('西瓜', { style: pinyin.STYLE_NORMAL }).join('') },
        { id: 5, name: '玫瑰', price: 1.50, codenumeber: '52345', notes: '', pinyin: pinyin('玫瑰', { style: pinyin.STYLE_NORMAL }).join('') },
        { id: 6, name: '苹果醋', price: 3.00, codenumeber: '62345', notes: '', pinyin: pinyin('苹果醋', { style: pinyin.STYLE_NORMAL }).join('') }
    ]);
    const [cashiers,setCashier] = ([
        { employeesId: '1001', name: 'Tom' },
        { employeesId: '1002', name: 'Jerry' }
    ]);
    const [chill, setChill] = useState([
        { id: 1, name: '苹果', price: 1.00, quantities: 5 , diacount:0},
        { id: 2, name: '橙子', price: 0.50, quantities: 2 , diacount:0},
        { id: 4, name: '西瓜', price: 2.00, quantities: 3 , diacount:0}
    ]);

    //我的个天哪,优惠打折花样的千奇百怪的
    // const [discounts,setDiscounts]=useState([
    //     {id: 4, name: '西瓜', price: 2.00,discount:0.9}
    // ])
    //  将折扣商品在chill里面遍历,如果主码相同,将discounts里面的item覆盖chill里面的,可行性不足50%
    //  折扣单独领出来分类,写函数,但是将折扣送到chill 里面呢(现在,如果没什么大事,chill是我数据输出上一级数据)
    //  啊啊啊啊啊啊啊啊啊啊啊啊,脑袋疼.
    return (
        <Paymentcontext.Provider value={{chill,setChill,products,cashiers}}>
            {/* //children到底是什么,所有的子组件吗 */}
            {/* {children} */}
            {/* //chill,products控制台有数值 */}
            {/* {console.log(chill,products)} */}
            <PaymentTocashier/>
            <Receipts/>
            <TableToReceipt/>
        </Paymentcontext.Provider>
    );
}
export function PaymentTocashier(){

    const { chill,setChill,products, cashiers,discounts} = useContext(Paymentcontext);
    const data = useContext(Paymentcontext);
    console.log({data})
    const [searchTerm, setsearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [chillTotal, setChillTotal] = useState(0);
    const [date, setDate] = useState(new Date());
    const [cashier, setCashier] = useState('');
    const navigate=useNavigate();


    useEffect(() => {
        const cashier = cashiers.find(p => p.employeesId === '1001');
        if (cashier) {
            setCashier(cashier.employeesId);
        }
    }, []);

    const handleProductsSearch = () => {
        if (searchTerm) {
            const results = products.filter(p => p.name.includes(searchTerm) || p.codenumeber.includes(searchTerm) || p.pinyin.includes(searchTerm));
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleQuantityChange = (id, value) => {
        setQuantities(prevQuantities => ({ ...prevQuantities, [id]: parseInt(value, 10) }));
    };

    

    const addToChill = (productId) => {
        const existingProduct = chill.find(item => item.id === productId);
        const productToAdd = products.find(item => item.id === productId);
        if (existingProduct) {
            // 商品已经存在，更新数量
            setChill(prevChill => prevChill.map(item => item.id === productId ? {...item, quantities: item.quantities + quantity} : item));
        } else if (productToAdd) {
            // 商品不存在，添加新的条目
            setChill(prevChill => [...prevChill, {...productToAdd, quantities: quantity}]);
        }
    };
    
    const calculateTotal = () => {
        let total = 0;
        for (let item of chill) {
            const product = products.find(p => p.id === item.id);
            if (product) {
                total += product.price * item.quantities;
            }
        }
        setChillTotal(total.toFixed(2));
    };

    useEffect(() => {
    setDate(new Date());
    }, []);

    //chill produc为空,context没传进来吗?
    console.log(chill,products);
    return (
        <>
            <div>
                <h1>收银</h1>
                <div>收银员：{cashier}</div>
                <div>结算时间：{date.toLocaleDateString()}</div>

                <div>
                <Select showSearch  style={{ width: 200 }} optionFilterProp="label"
                    value={searchTerm} onChange={value => setsearchTerm(value)}>
                    {
                        products.map(item => (
                            <Option value={item.name} label={item.pinyin + item.name}>{item.name}</Option>
                        ))
                    }
                </Select>
                <button  onClick={handleProductsSearch}>搜索</button>
                <ul>
                    {searchResults.map(result => (
                        <li key={result.id}>
                            {result.name}
                            <input type="number" min="1" value={quantities[result.id] || ''} 
                            onChange={e => handleQuantityChange(result.id, e.target.value)} />
                        <button onClick={() => addToChill(result.id, quantities[result.id])}>添加到chill</button>

                            {console.log(quantities[result.id])}
                        </li>
                    ))}                   
                </ul>                
                </div>
                <div><TableToReceipt/></div>
                <button onClick={calculateTotal}>结算</button>
                <p>总价: {chillTotal}</p>
            </div>
            <div>
                {/* <button onClick={()=>navigate('/receipt')}>收据打印</button> */}
                <button><Link to='/receipt'>收据打印</Link></button>
            </div>
            <div>
                <button><Link to='/'>返回首页</Link></button>
            </div>
        </>
    );
}

export const TableToReceipt = ()=>{
    const { chill, setChill, products, cashiers} = useContext(Paymentcontext);
    return(
        <table>
        <thead>
            <tr>
               <th>商品编号</th>
               <th>商品名称</th>
               <th>单价</th>
               <th>数量</th>
               <th>折扣</th>
               <th>总价</th>
            </tr>
        </thead>
        <tbody>
            {chill.map((item, index) => {
                const product = chill.find(p => p.id === item.id);
                return product ? (
                <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.quantities}</td>
                    <td>0</td>
                    <td>{(product.quantities * product.price).toFixed(2)}</td>
                </tr>
                ) : (
                    <tr key={index}>
                        <td colSpan={6}>找不到产品 ID {item.id}</td>
                    </tr>
                );
            })}
        </tbody>
    </table>
    );
}
