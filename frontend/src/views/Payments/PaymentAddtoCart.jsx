// 商品折扣
export const GetDiscountedPrice = async (barcode) => {
  try {
      const response = await fetch(`/api/discountitemsinfo?id=${barcode}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          const errorText = await response.text();
          alert(`查询折扣数据失败: ${errorText}`);
          return null; 
      }

      const data = await response.json();
      return data; 
  } catch (error) {
      alert('网络错误，请稍后再试');
      console.error('Error:', error);
      return null; // 返回 null 表示没有折扣
  }
};
