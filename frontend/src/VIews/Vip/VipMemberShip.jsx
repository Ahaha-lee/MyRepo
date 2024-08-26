import { useState } from "react";
import { GetLastVIP } from "../../utils/vip";
import { DashtableToPoints} from './Points';
import { getLocalStorage,setLocalStorage} from "../../utils/storageways";
import { VIPKEY } from "../../Mock/mock";


export function AddVipMembership() {
  const initialvip = getLocalStorage(VIPKEY,true)
  const [vipName, setVipName] = useState('');
  const [vipPhone, setVipPhone] = useState('');
  const [aMemberResults,setAmemberResults]=useState([]);

  const handleVipNameAdd = (event) => {
    setVipName(event.target.value);
  };

  const handleVipPhoneAdd = (event) => {
    setVipPhone(event.target.value);
  };
  const handleAddMemberClick = () => {
    const checkPhone = initialvip.find(
      p => p.phone=== vipPhone
    );
    console.log('输入电话号码',vipPhone)
    if (/^\d{11}$/.test(vipPhone)&&!checkPhone) {
          setVipPhone(vipPhone);
          const newVipId = GetLastVIP() + 1;
          console.log('新增会员id', newVipId);

          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().slice(0, 19);
          console.log('会员注册时间', formattedDate);

          const newMemberData = {
            vip_id: newVipId,
            vipname: vipName,
            nowpoints: 0,
            usedpoints: 0,
            phone: vipPhone,
            regisdate: formattedDate
          }; 
          console.log('新对象数据',newMemberData);
          initialvip.push(newMemberData);
          setLocalStorage(VIPKEY,initialvip,true);
          setAmemberResults((prev)=>[newMemberData]);        
      }
    else {
            alert('电话号码有误（必须为11位数或者该电话号码已注册）');
          }
  };

  return (
    <div>
      注册会员<br />
      会员姓名 <input 
                type="text"
                value={vipName}
                onChange={handleVipNameAdd}
                required
                placeholder="请输入新会员的姓名" />
      <br/>
      会员电话 <input 
                type="text"
                value={vipPhone}
                onChange={handleVipPhoneAdd}
                required
                placeholder="请输入会员的电话号码" />
      <div>
        <button onClick={handleAddMemberClick}>注册会员</button><br/>
        <DashtableToPoints vip_Results={aMemberResults}/>
      </div>
    </div>
  );
}


export function DeleteVipMemberShip(){
  
  const [logoutPhone,setLogoutPhone] = useState('');
  const [logoutName,setLogoutName] = useState('');
  const initialvip = getLocalStorage(VIPKEY,true);
  const [vipMembers, setVipMembers] = useState(initialvip);
  const handleVipNameOut = (event)=>{
    setLogoutName(event.target.value);
  }
  const handleVipPhoneOut = (e) =>{
    setLogoutPhone(e.target.value);
  }
  function handleOutVipMemberClick() {

    const remainVip = vipMembers.filter(v => 
      v.phhone !== logoutPhone && v.vipname !== logoutName
  );

  console.log(remainVip);
  if (remainVip.length < vipMembers.length) {
      setVipMembers(remainVip);
      console.log(vipMembers)
      setLocalStorage(VIPKEY, remainVip,true); // 持久化更改
  } else {
      alert('会员不存在或信息不匹配');
  }
}

  return(
    <div>
      会员注销<br/>
      注销会员电话：<input type="text" 
                    value={logoutPhone}
                    onChange={handleVipPhoneOut} 
                    required
      /><br/>
      注销会员姓名：<input type="text" 
                    value={logoutName}  
                    onChange={handleVipNameOut}
      /><br/>
      <button onClick={handleOutVipMemberClick}>注销会员</button>
    </div>
  );
}
