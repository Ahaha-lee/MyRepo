import React, { useState } from 'react';

export function PaymentPuls() {
  const [shoppingcar, setShoppingcar] = useState([]); // 购物车信息
  const [totalPrice, setTotalPrice] = useState(0); // 总价

  // 添加商品到购物车
  const addToCart = (product) => {
    const existingItem = shoppingcar.find((item) => item.id === product.id);
    if (existingItem) {
      // 如果商品已经在购物车中, 数量加1
      const updatedCart = shoppingcar.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setShoppingcar(updatedCart);
      setTotalPrice(totalPrice + product.price);
    } else {
      // 如果商品不在购物车中, 添加新的商品
      setShoppingcar([...shoppingcar, { ...product, quantity: 1 }]);
      setTotalPrice(totalPrice + product.price);
    }
  };

  // 从购物车中删除商品
  const removeFromCart = (product) => {
    const updatedCart = shoppingcar.filter((item) => item.id !== product.id);
    setShoppingcar(updatedCart);
    setTotalPrice(totalPrice - product.price * product.quantity);
  };

  return (
    <div>
      <h1>购物车</h1>
      <ul>
        {shoppingcar.map((item) => (
          <li key={item.id}>
            {item.name} - 条码: {item.barcode} - 单价: {item.price} - 数量: {item.quantity}
            <button onClick={() => removeFromCart(item)}>删除</button>
          </li>
        ))}
      </ul>
      <p>总价: {totalPrice.toFixed(2)}</p>
      <button>结算</button>
    </div>
  );
}
