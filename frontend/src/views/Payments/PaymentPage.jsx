import React, { createContext, useState, useContext, useEffect } from 'react';
import { ProductApi, ProductCacheApi } from '../../api/storage/product';
import { DiscoutApi } from '../../api/payment/discount';
import {VIPListApi} from '../../api/vip/index'
import { useNavigate } from 'react-router-dom';

export const CashierContext = createContext();

export default function PaymentPage() {
    return (
        <CashierProvider>
            <div className='row'>
                <div className='col-md-5'>
                    <PaymentPageForm />
                </div>
                <div className='col-md-7'>
                    <HotProductPage />
                    <DiscountRules />
                </div>
            </div>
        </CashierProvider>
    );
}

export const CashierProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [members, setMembers] = useState([]);
    const [cart, setCart] = useState({
        items: [],
        total: 0,
        discountedTotal: 0,
    });
    const [productCache, setProductCache] = useState([]); // 缓存对象
    const [discountRules, setDiscountRules] = useState([]); // 可用优惠规则
    const [errormessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        calculateTotals(); // 计算总价和折扣
    }, [cart.items]); // 当购物车项变化时重新计算

    useEffect(() => {
        fetchDiscountRules(); // 获取优惠规则
    }, []);

    const fetchDiscountRules = async () => {
        try {
            const response = await DiscoutApi.get({ params: { search_id: 0, page: 0 } });
            console.log("discountType返回的数据", response);
            // 过滤出所有 Status 为 1 的折扣
            const validDiscounts = response.discounts.filter(discount => discount.Status === 1);
            // 更新状态
            setDiscountRules(validDiscounts);
            console.log("validDiscounts", validDiscounts);
        } catch (error) {
            console.error('获取优惠规则错误:', error);
        }
    };

    const fetchMembers = async (vipid) => {
        try {
            const response = await VIPListApi.list({ params: { search_id: vipid } });
            console.log("viplist返回的数据", response);
            setMembers(response.vipinfo[0]);
        } catch (error) {
            console.error('获取会员信息错误:', error);
        }
    };

    const fetchProducts = async (productkeyword) => {
        try {
            const response = await ProductApi.searchhotproduct({ params: { search_id: productkeyword } });
            console.log("productlist返回的数据", response);
            setProducts(response.product);
        } catch (error) {
            console.error('获取商品信息错误:', error);
            setErrorMessage('无法获取产品数据，请稍后再试。'); // 设置错误信息
        }
    };

    const fetchProductCache = async () => {
        try {
            const response = await ProductCacheApi.getallinfo();
            console.log("缓存返回的数据:", response);
            if (!response) {
                console.log("缓存为空");
                return;
            }
            const productsArray = response.map((item) => item.Product);
            setProductCache(productsArray);
        } catch (error) {
            console.error('获取缓存商品信息错误:', error);
        }
    };
    const calculateDiscountedPrice = (product) => {
        let finalPrice = product.RetailPrice;
        const applicableDiscounts = discountRules.filter(discount => discount.RuleTypeid === 0);
        console.log("app",applicableDiscounts)
        
        if (applicableDiscounts.length > 0) {
            applicableDiscounts.forEach(discount => {
                const { DiscountRate, DiscountItems } = discount;
                if (DiscountItems === "全部商品" || DiscountItems.split(',').map(id => id.trim()).includes(product.ProductID.toString())) {
                    finalPrice *= DiscountRate;
                }
            });
        }  
        return finalPrice;  
    };
    
    
    const calculateTotals = () => {
        const total = cart.items.reduce((sum, item) => sum + item.RetailPrice * item.quantity, 0);
        let discountedTotal = 0;
    
        cart.items.forEach(item => {
            const finalPrice = calculateDiscountedPrice(item);
            console.log("1",finalPrice)
            discountedTotal += finalPrice * item.quantity; // 计算折扣后的总价
        });

    
        // 处理满减逻辑
        let totalDiscountAmount = 0;
        discountRules.forEach(discount => {
            const { RuleTypeid, DiscountAmount, DiscountItems, Minprice } = discount;
    
            if (RuleTypeid === 0) {
                // 满减逻辑，适用于DiscountItems中的商品
                if ((DiscountItems === "全部商品" || DiscountItems.split(',').map(id => id.trim()).includes(cart.items[0].ProductID.toString())) && total >= Minprice) {
                    totalDiscountAmount += DiscountAmount; // 累积满减金额
                }
            }
            if (totalDiscountAmount >Minprice){
                // 应用满减
               discountedTotal = Math.max(0, discountedTotal - totalDiscountAmount);
            }
        });
    
        setCart(prevCart => ({
            ...prevCart,
            total,
            discountedTotal,
        }));
    };
    
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.items.find(item => item.ProductID === product.ProductID);
            const finalPrice = calculateDiscountedPrice(product);
    
            if (existingItem) {
                const updatedItems = prevCart.items.map(item => {
                    if (item.ProductID === product.ProductID) {
                        const newQuantity = item.quantity + 1;
                        return {
                            ...item,
                            quantity: newQuantity,
                            total: finalPrice * newQuantity // 更新商品总价
                        };
                    }
                    return item;
                });
    
                const newTotalPrice = updatedItems.reduce((acc, item) => acc + item.total, 0);
    
                return {
                    ...prevCart,
                    items: updatedItems,
                    total: newTotalPrice, // 更新购物车总价
                    discountedTotal: newTotalPrice // 更新折扣后总价
                };
            } else {
                const newItem = { ...product, quantity: 1, total: finalPrice }; // 初始化商品总价
                const updatedItems = [...prevCart.items, newItem];
                const newTotalPrice = prevCart.total + newItem.total;
    
                return {
                    ...prevCart,
                    items: updatedItems,
                    total: newTotalPrice, // 更新购物车总价
                    discountedTotal: newTotalPrice // 更新折扣后总价
                };
            }
        });
    };
    


    const removeFromCart = (productId) => {
        setCart(prevCart => ({
            ...prevCart,
            items: prevCart.items.filter(item => item.ProductID !== productId),
        }));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return; 
        setCart(prevCart => ({
            ...prevCart,
            items: prevCart.items.map(item =>
                item.ProductID === productId ? { ...item, quantity } : item
            ),
        }));
    };
     

    
    const checkout = async (vip) => {
        try {
    
            // 如果是会员，修改积分
            // if (vip) {
            //    navigate("/vip/points")
            // }
    
            // 清空购物车
            setCart({
                items: [],
                total: 0,
                discountedTotal: 0,
            });
             window.alert("结账成功")
    
        } catch (error) {
            console.error('Checkout error:', error);
        }
    }
    console.log(cart);

    return (
        <CashierContext.Provider value={{ products, members, cart, addToCart, removeFromCart, updateQuantity, calculateTotals, 
         checkout,productCache, setProductCache, fetchProducts, discountRules, fetchProductCache, }}>
            {children}
        </CashierContext.Provider>
    );
};

// 使用 Context 的自定义 Hook
export const useCashier = () => {
    return useContext(CashierContext);
};

// 收银前台页面组件
export function PaymentPageForm() {
    const { products, cart, addToCart, removeFromCart, updateQuantity, checkout, fetchProducts, errormessage } = useCashier();
    const [searchTerm, setSearchTerm] = useState('');
    const [isMember, setIsMember] = useState(false)


    const handleSearch = () => {
        fetchProducts(searchTerm);
    };

    const handleCheckout = () => {
        if (isMember) {
            checkout(true); // 会员结账
        } else {
            checkout(false); // 非会员结账
        }
    };

    return (
        <div className="d-flex">
            <div className="container">
                <h2>收银前台</h2>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="搜索商品"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={() => handleSearch()}>搜索</button>
                </div>
                <div className="input-group mb-3">
                    顾客为会员：（默认非会员）<input 
                       type='radio'
                       className='formcontrol'
                       value={true}
                       onChange={(e)=>setIsMember(e.target.value)}
                       />
                </div>

                <div className="mb-4">
                    <table className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>商品编号</th>
                                <th>商品名称</th>
                                <th>零售价(元)</th>
                                <th>折扣价(元)</th>
                                <th>条码</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.ProductID}>
                                    <td>{product.ProductID}</td>
                                    <td>{product.ProductName}</td>
                                    <td>{product.RetailPrice}</td>
                                    <td>{product.RetailPrice}</td>
                                    <td>{product.ProBarcode}</td>
                                    <td>
                                        <button className="btn btn-success" onClick={() => addToCart(product)}>添加到购物车</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                    {cart.items.length === 0 ? (
                        <p>购物车为空</p>
                    ) : (
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th>商品名称</th>
                                    <th>数量</th>
                                    <th>单价</th>
                                    <th>折扣价</th>
                                    <th>小计</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.items.map(item => (
                                    <tr key={item.ProductID}>
                                        <td>{item.ProductName}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.RetailPrice}</td>
                                        <td>{(item.total / item.quantity).toFixed(2)}</td>
                                        <td>{item.total.toFixed(2)}</td>
                                        <td>
                                            <button className="btn btn-warning" onClick={() => updateQuantity(item.ProductID, item.quantity - 1)}>-</button>
                                            <button className="btn btn-warning" onClick={() => updateQuantity(item.ProductID, item.quantity + 1)}>+</button>
                                            <button className="btn btn-danger" onClick={() => removeFromCart(item.ProductID)}>删除</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div className="mt-3">
                        <h5>总价（元）: {cart.total.toFixed(2)}</h5>
                        <h5>折扣后总价（元）: {cart.discountedTotal.toFixed(2)}</h5>
                    </div>
                    <div>
                        
                    </div>
                    <button className="btn btn-primary mt-2" onClick={()=>handleCheckout()}>结账</button>
                </div>
            </div>
        </div>
    );
}

// 显示优惠规则的组件
export function DiscountRules() {
    const { discountRules } = useCashier();

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">可用优惠规则</h2>
            <div className="list-group">
                {discountRules.map(rule => (
                    <div className="list-group-item" key={rule.DiscountruleId}>
                        <p className="mb-1">最低消费: <strong>{rule.Minprice}元</strong></p>
                        <p className="mb-1">折扣金额: <strong>{rule.DiscountAmount}元</strong></p>
                        <p className="mb-1">折扣率: <strong>{(rule.DiscountRate * 100).toFixed(2)}%</strong></p>
                        <p className="mb-1">适用商品: <strong>{rule.DiscountItems}</strong></p>
                        <p className="mb-1">是否VIP: <strong>{rule.Isvip ? '是' : '否'}</strong></p>
                        <p className="mb-1">开始日期: <strong>{new Date(rule.StartDate).toLocaleString()}</strong></p>
                        <p className="mb-1">结束日期: <strong>{new Date(rule.EndDate).toLocaleString()}</strong></p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function HotProductPage() {
    const [Results, setResults] = useState([]);
    const { products, cart, addToCart, removeFromCart, updateQuantity, checkout, fetchProducts } = useCashier();

    useEffect(() => {
        getlist();
    }, []);

    const getlist = () => {
        try {
            ProductCacheApi.getallinfo().then((res) => {
                console.log("缓存返回的数据:", res);

                if (!res) {
                    console.log("缓存为空");
                    return
                }

                // 提取 product 信息并组成新数组
                const productsArray = res.map((item) => item.Product);

                // 设置结果
                setResults(productsArray);
            });
        } catch (error) {
            console.error('错误信息:', error);
        }
    };

    return (
        <div className="container">
            <h2 className="text-center my-4">热销产品</h2>
            <div className="row">
                {Results.length > 0 ? (
                    Results.map((product) => (
                        <div className="col-md-3 mb-4" key={product.ProductID}>
                            <div 
                                className="card h-100 shadow-sm" 
                                onClick={() => addToCart(product)} 
                                style={{ cursor: 'pointer' }} // 添加手型光标
                            >
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">{product.ProductName}</h5>
                                    <p className="card-text">
                                        <strong>零售价:</strong> ${product.RetailPrice.toFixed(2)}
                                    </p>
                                    <p className="card-text text-danger">
                                        <strong>折扣价:</strong> ${(product.RetailPrice * 0.7).toFixed(2)}
                                    </p>
                                    <p className="card-text">
                                        <strong>条码:</strong> {product.ProBarcode}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <h5>暂无热销产品</h5>
                    </div>
                )}
            </div>
        </div>
    );
}