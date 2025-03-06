
import React from 'react';
import { useState } from 'react';
import { VipDash } from './dashtable';
import { VIPPointsApi } from '../../api/vip'; 
import MainLayout from '../../utils/MainLayOut/MainLayout'
export function ChangePointsPage(){
  return(
    <MainLayout rightContent={<VIPPointsForm/>}></MainLayout>
  );
}

export const VIPPointsForm=()=>{
  return(
    <div>
      {/* <div> <VIPPointsRules /></div> */}
      {/* <hr/> */}
      <div><ChangePoints/></div>
    </div>
  );
}

// export const VIPPointsRules = () => {
//   const [discount, setDiscount] = useState('');
//   const [message, setMessage] = useState('');

//   const handleDiscountChange = (e) => {
//     const value = e.target.value;
//     if (parseFloat(value) >= 0 && parseFloat(value) <= 100) {
//       setDiscount(value);
//       setMessage('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await VIPPointsApi.setDiscount({
//         data: { discount: parseFloat(discount) }
//       });
//       console.log("积分比例设置成功", response);
//     } catch (error) {
//       console.log("错误信息", error);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label htmlFor="discount" className="form-label">设置积分折扣 (%):</label>
//           <input
//             type="text"
//             id="discount"
//             name="discount"
//             value={discount}
//             placeholder="请输入积分比例值"
//             onChange={handleDiscountChange}
//           />
//         </div>
//         <button type="submit" className="btn btn-primary">提交</button>
//         {message && <p><span className="text-danger">{message}</span></p>}
//       </form>
//     </div>
//   );
// };

export const ChangePoints = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [reminder,setReminder]=useState('');
  const [changeResult, setChangeResult] = useState(null); // 存储更新后的会员信息
  const [data, setData] = useState({
    value: '',
    updateNowPoints: false,
    updateUsedPoints: false,
  });

  const VipHandle = (e) => {
    const { name, value } = e.target;
  
    if (name === 'operation') {
      // 根据选择的操作更新状态
      if (value === 'add') {
        setData(prev => ({ ...prev, updateNowPoints: true, updateUsedPoints: false }));
      } else if (value === 'delete') {
        setData(prev => ({ ...prev, updateNowPoints: false, updateUsedPoints: true }));
      }
    } else if (name === 'value') {

      parseInt(value, 10) >0 ?(
      // 将输入的值转换为整数
      setData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }))
     ):(
      setMessage("请输入正确的整数值!")
     )
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setChangeResult(null);
    
    const { updateNowPoints, updateUsedPoints } = data;
  
    let type;
    if (updateNowPoints) {
      type = "add";
    } else if (updateUsedPoints) {
      type = "delete";
    } else {
      setMessage("请选择要更新的类型!");
      return;
    }
  
    try {
      const response = await VIPPointsApi.vippoints({
        params: { update_id: phone },
        data: {
          value: parseInt(data.value, 10), 
          updateNowPoints: data.updateNowPoints,
          updateUsedPoints: data.updateUsedPoints,
        }
      });
      
      console.log("更新会员积分返回的数据", response);
      setChangeResult(response.vip); 
      setReminder(response);
    } catch (error) {
      console.log("错误信息", error); // 这里应该能输出错误信息
      if (error.response && error.response.data) {
        console.log("错误信息", error.response.data.errormessage);
        setMessage(error.response.data.errormessage);
      } else {
        setMessage(error.message);
      }
    }
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">修改会员电话号码：</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={phone}
                placeholder="请输入注册会员电话号码"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className='mb-3'>
              <label htmlFor="operation" className="form-label">操作选项:</label>
              <div className="form-check form-check-inline">
                <input 
                  type="radio" 
                  className="form-check-input" 
                  id="add"
                  name="operation" 
                  value="add"
                  onChange={VipHandle}
                />
                <label className="form-check-label" htmlFor="add">增加</label>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <input 
                  type="radio" 
                  id="delete"
                  name="operation" 
                  value="delete"
                  onChange={VipHandle}
                />
                <label className="form-check-label" htmlFor="delete">删除</label>
              </div>
            </div>
            <div className='mb-3'>
              <label htmlFor="value" className="form-label">{data.updateNowPoints ? "增加的分数:" : "删除的分数:"}</label>
              <input
                type="text"
                id="value"
                name="value"
                value={data.value}
                placeholder="请输入分数"
                onChange={VipHandle}
              />
            </div>
            <button type="submit" className="btn btn-primary">提交</button>
            {changeResult && <VipDash Results={changeResult} />} {/* 显示更新后的会员信息 */}
            {message && <p><span className="text-danger">{message}</span></p>} {/* 显示操作结果信息 */}
          </div>
      </form>
    </div>
  );
};
