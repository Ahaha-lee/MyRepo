

import React, { useState } from 'react';

export function ProductinfoDelete() {
   
    const [barcode, setBarcode] = useState('');
    const reqdata={
        id:barcode,
        keyword:"PROBarcode",
        tablename:"productsdata"
    }

    async function handleDelete() {
        try {
      
            const response = await fetch(`/api/tableinfodelete`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqdata),
            });
    
            if (!response.ok) {
              const errorText = await response.text();
              alert(`删除数据1失败: ${errorText}`);
              return;
            }
            const reqdata1=({
                id:barcode,
                keyword:"INVBarcode",
                tablename:"inventorydata"
            });
            
            const response1=await fetch(`/api/tableinfodelete`,{
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(reqdata1),
            });
            
            if (!response1.ok) {
                const errorText = await response.text();
                alert(`删除数据2失败: ${errorText}`);
                return;
              }
            alert("删除成功");
        } catch (error) {
          alert('网络错误，请稍后再试');
          console.error('Error:', error);
        }
      }
    

    return (
        <div>
            <label>
                删除商品条码：
                <input 
                    type="text" 
                    value={barcode} 
                    onChange={(e) => setBarcode(e.target.value)} 
                />
            </label>
            <button onClick={handleDelete}>删除</button> {/* 删除按钮 */}
        </div>
    );
}
