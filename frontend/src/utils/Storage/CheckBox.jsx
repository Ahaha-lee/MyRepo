// 初始化复选框状态的函数
export const initializeCheckboxStates = (items) => {
    return items.reduce((acc, product) => {
      acc[items.ProductID] = false;
      return acc;
    }, {});
  };
  
  // 处理全选框点击事件的函数
export const handleSelectAllClick = (products, selectAllChecked) => {
    const newSelectAllChecked = !selectAllChecked;
    const newCheckboxStates = {};
    products.forEach((product) => {
      newCheckboxStates[product.ProductID] = newSelectAllChecked;
    });
    return { newCheckboxStates, newSelectAllChecked };
  };
  
  // 处理单个复选框点击事件的函数
export const handleCheckboxChange = (prevStates, product_id) => {
    return {
      ...prevStates,
      [product_id]: !prevStates[product_id]
    };
  };
  

  