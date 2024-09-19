import { useState } from "react";
import { DashtableToPoints } from "./VIPPoints";
import useSession from "../../useSession";
import { RealTimeClock } from "../../Components/groceries";


export const AddVipMembership = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [currenttime,setcurrenttime] = useState();
  const {getSession} = useSession();
  const handler =getSession()
  const handleSubmit = async (e) => {
    e.preventDefault();
  

    const newVip = {
      FirstName: firstName,
      LastName: lastName,
      Phone: phone,
     JoinDate: currenttime,
     RegiHandler:handler.EmployeeID,
    };

    try {
      const response = await fetch('/api/vip/registervip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newVip),
      });
      console.log(newVip)

      if (!response.ok) {
        throw new Error('插入数据失败');
      }

      const data = await response.text();
      setMessage(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>注册新会员</h1>
      <form onSubmit={handleSubmit}>
          注册会员姓氏:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          /><br/>
          注册会员名：
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          /><br/>
          注册会员电话号码：
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          /><br/>
          注册时间：
          <RealTimeClock setCurrentTime={setcurrenttime}/>
        <button type="submit">注册</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

// 会员注销
export function DeleteVipMemberShip() {
  const [logoutPhone, setLogoutPhone] = useState('');
  const [logoutFName, setLogoutFName] = useState('');
  const [logoutLName, setLogoutLName] = useState('');
  const { getSession } = useSession();
  const handler = getSession();

  const handleVipFNameOut = (event) => {
    setLogoutFName(event.target.value);
  };

  const handleVipLNameOut = (event) => {
    setLogoutLName(event.target.value);
  };

  const handleVipPhoneOut = (e) => {
    setLogoutPhone(e.target.value);
  };

    //找到注销会员
  async function checkVipExists() {
    const response = await fetch(`/api/vip?vipphone=${logoutPhone}`); 
    if (!response.ok) {
      throw new Error('检查 VIP 失败');
    }
    const data = await response.json(); // 假设返回的是 JSON 格式
    console.log('VIP 数据:', data); // 输出返回的 VIP 数据

    return data; // 返回数据以供后续使用
  }


  async function handleOutVipMemberClick() {
    try {
      const vipExists = await checkVipExists();
      console.log(vipExists)
      if (vipExists) {
        const response = await fetch(`/api/vip/deletevip?vipphone=${logoutPhone}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorText = await response.text();
          alert(`删除数据失败: ${errorText}`);
          return;
        }

        const rowsAffected = await response.text();
        alert(`删除成功，受影响的行数: ${rowsAffected}`);
        
        // 可选：从本地存储或状态中移除已删除的 VIP
      } else {
        alert('会员不存在或信息不匹配');
      }
    } catch (error) {
      alert('网络错误，请稍后再试');
      console.error('Error:', error);
    }
  }

  return (
    <div>
      会员注销<br />
      注销会员电话：<input type="text" 
                    value={logoutPhone}
                    onChange={handleVipPhoneOut} 
                    required
      /><br />
      注销会员姓氏：<input type="text" 
                    value={logoutFName}  
                    onChange={handleVipFNameOut}
      /><br />
      注销会员名：<input type="text" 
                  value={logoutLName}  
                  onChange={handleVipLNameOut}
      /><br />
      注销操作人员：{handler.EmployeeID}<br/>
      <button onClick={handleOutVipMemberClick}>注销会员</button>
    </div>
  );
}