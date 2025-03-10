import React, { createContext, useState, useContext, useEffect } from 'react';
import { ProductApi, ProductCacheApi } from '../../api/storage/product';
import { VIPListApi } from '../../api/vip';
import { DiscoutApi, DiscountTypeApi } from '../../api/payment/discount';
const CashierContext = createContext();

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
    const [discountType, setDiscountType] = useState([]);
    const [cart, setCart] = useState({
        items: [],
        total: 0,
        discountedTotal: 0,
    });
    const [productCache, setProductCache] = useState([]); // 缓存对象
    const [discountRules, setDiscountRules] = useState([]); // 可用优惠规则

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
            VIPListApi.list(
                { params: { search_id: vipid } }
            ).then(data => {
                console.log("viplist返回的数据", data);
                setMembers(data.vipinfo[0]);
            })
        } catch (error) {
            console.error('错误的信息:', error);
        }
    }

    const fetchDiscounts = async (search_id) => {
        DiscountTypeApi.get(
            {
                params: {
                    search: search_id,
                    page: 1
                }
            }).then((res) => {
                console.log("list返回的数据", res);
                setDiscountType(res.discountTypes);
            })

    };

    const fetchProducts = async (productkeyword) => {
        try {
            ProductApi.searchhotproduct(
                { params: { search_id: productkeyword } }
            ).then(res => {
                console.log("productlist返回的数据", res);
                setProducts(res.product);
            })
        } catch (error) {
            console.error('错误信息', error);
        }
    };

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.items.find(item => item.ProductID === product.ProductID);

            if (existingItem) {
                // 如果商品已存在，增加数量
                return {
                    ...prevCart,
                    items: prevCart.items.map(item => {
                        if (item.ProductID === product.ProductID) {
                            const newQuantity = item.quantity + 1;
                            return {
                                ...item,
                                quantity: newQuantity,
                                total: item.RetailPrice * newQuantity // 更新商品总价
                            };
                        }
                        return item;
                    }),
                    total: prevCart.items.reduce((acc, item) => acc + item.total, 0), // 计算购物车总价
                    discountedTotal: prevCart.items.reduce((acc, item) => acc + item.total, 0) // 计算折扣后总价（如果有折扣逻辑）
                };
            } else {
                // 如果商品不存在，添加新商品
                const newItem = { ...product, quantity: 1, total: product.RetailPrice }; // 初始化商品总价
                return {
                    ...prevCart,
                    items: [...prevCart.items, newItem],
                    total: prevCart.total + newItem.total, // 更新购物车总价
                    discountedTotal: prevCart.discountedTotal + newItem.total // 更新折扣后总价
                };
            }
        });
    };


    const removeFromCart = (productId) => {
        setCart(prevCart => ({
            ...prevCart,
            items: prevCart.items.filter(item => item.id !== productId),
        }));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return; 
        setCart(prevCart => ({
            ...prevCart,
            items: prevCart.items.map(item =>
                item.id === productId ? { ...item, quantity } : item
            ),
        }));
    };

    const calculateTotals = () => {
        const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setCart(prevCart => ({
            ...prevCart,
            total,
            discountedTotal: total * 0.9, 
        }));
    };

    const applyDiscounts = () => {
        let discountedTotal = cart.total;
        discountRules.forEach(rule => {
            if (cart.total >= rule.Minprice) {
                discountedTotal -= rule.DiscountAmount;
            }
        });
        setCart(prevCart => ({
            ...prevCart,
            discountedTotal,
        }));
    };

    const checkout = async () => {
        try {
            applyDiscounts();
            // 结账逻辑
        } catch (error) {
            console.error('Checkout error:', error);
        }
    };

    return (
        <CashierContext.Provider value={{ products, members, cart, addToCart, removeFromCart, updateQuantity, calculateTotals, checkout, productCache, setProductCache, fetchProducts, discountRules }}>
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
    const { products, cart, addToCart, removeFromCart, updateQuantity, checkout, fetchProducts } = useCashier();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        fetchProducts(searchTerm);
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

                <div className="mb-4">
                    <table className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>商品编号</th>
                                <th>商品名称</th>
                                <th>零售价</th>
                                <th>折扣价</th>
                                <th>条码</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.ProductID}>
                                    <td>{product.ProductID}</td>
                                    <td>{product.ProductName}</td>
                                    <td>${product.RetailPrice}</td>
                                    <td>${product.RetailPrice * 0.9}</td>
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
                                        <td>${item.RetailPrice}</td>
                                        <td>${(item.RetailPrice * 0.9).toFixed(2)}</td>
                                        <td>${(item.RetailPrice * item.quantity).toFixed(2)}</td>
                                        <td>
                                            <button className="btn btn-warning" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <button className="btn btn-warning" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                            <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>删除</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div className="mt-3">
                        <h5>总价: ${cart.total.toFixed(2)}</h5>
                        <h5>折扣后总价: ${cart.discountedTotal.toFixed(2)}</h5>
                    </div>
                    <button className="btn btn-primary mt-2" onClick={checkout}>结账</button>
                </div>
            </div>
        </div>
    );
}

// 显示优惠规则的组件
export function DiscountRules() {
    const { discountRules } = useCashier();

    return (
        <div className="container">
            <h2>可用优惠规则</h2>
            <ul>
                {discountRules.map(rule => (
                    <li key={rule.DiscountruleId}>
                        规则ID: {rule.DiscountruleId}, 最低消费: ${rule.Minprice}, 折扣金额: ${rule.DiscountAmount}, 折扣率: {rule.DiscountRate}%
                    </li>
                ))}
            </ul>
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
            <h2>热销产品</h2>
            <div className="row">
                {Results.length > 0 ?
                    (Results.map((product) => (
                        <div className="col-md-3 mb-4" key={product.ProductID}>
                            <div className="card" onClick={() => addToCart(product)} >
                                <div className="card-body">
                                    <h5 className="card-title">{product.ProductName}</h5>
                                    <p className="card-text">零售价: ${product.RetailPrice}</p>
                                    <p className="card-text">折扣价: ${product.RetailPrice * 0.9}</p>
                                    <p className="card-text">条码: {product.ProBarcode}</p>
                                </div>
                            </div>
                        </div>
                    ))) : <div>暂无热销产品</div>}
            </div>
        </div>
    );
}
