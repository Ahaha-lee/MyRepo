import Modal from 'react-modal';
import React, {useState } from 'react';


export function ShowVip({ vip }) {
    return (
        <div>
            <p>会员名称: {vip.firstname+vip.lastname}</p>
            <p>会员电话: {vip.phone}</p>
            <p>会员现有积分: {vip.nowpoints}</p>
        </div>
    );
}


export function CashModel ({isOpen, onClose,totalprice,onSubmit}){
  const [vipphone,setVipPhone]=useState("")
  const [results,setResults]=useState("")

    // VIP信息查询
  async function handleVipSelect() {

    try {
      const response = await fetch(`/api/vip/search?vipphone=${vipphone}`, {
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

  const handleSubmit=()=>{
        const vipdata=({
            vipphone:results.phone,
            addpoints:Number(totalprice)
        })
        onSubmit(vipdata)
  }


    return(  
        <Modal isOpen={isOpen} onRequestClose={onClose}>   
        <>
        商品总价：{totalprice}人民币<br/>
        vip会员号码：
        <input type="text" 
        value={vipphone}
        onChange={(e)=>setVipPhone(e.target.value)}
        />
        <button onClick={handleVipSelect}>查询</button>
        {results&&<ShowVip vip={results}/>}<br/>
        <button onClick={handleSubmit}>订单完成</button>
        </>
        </Modal>
    );
        
    
}