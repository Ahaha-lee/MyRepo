import { useState } from "react";
import { getLocalStorage } from "../../utils/localstorage";
import { SearchVipApi, VipMemberApi } from "../../api/vip";
import Modal from 'react-modal';
import { ErrorPage } from "../Employees/error";
import { VipDash } from "./dashtable";

export const AddVipMembership = () => {
  const [message, setMessage] = useState('');  // 错误信息
  const [reminder, setReminder] = useState(''); // 提醒消息
  const handler = getLocalStorage('session').name;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
      VipMemberApi.vip({
        type: 'add',
        data: {
          Name: name,
          Phone: phone,
          RegiHandler: handler
        },
      }).then(res => {
        console.log("注册会员返回数据", res);
        setReminder(res.message);
        setTimeout(() => {
          setReminder('');
        }, 3000);
      }).catch(error => {
        if (error.response && error.response.data){
         console.log("错误信息",error.response.data.errormessage);
          setMessage(error.response.data.errormessage);
        }else{
          setMessage(error.message);
        }
      });
  };

  const VipHandle = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'phone') {
      setPhone(value);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="row g-0">
          <div className="col-5"></div>
          <div className="col-3">
            <h2 className="text-center">会员注册</h2>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">注册会员姓名：</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={name}
                placeholder="请输入注册会员姓名"
                onChange={VipHandle}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">注册会员电话：</label>
              <input
                type="tel" // 修改为 tel
                className="form-control"
                id="phone"
                name="phone"
                value={phone}
                placeholder="请输入会员手机号码"
                onChange={VipHandle}
              />
            </div>
            <button type="submit" className="btn btn-primary">提交</button>
            {message && <p className="text-danger">{message}</p>}
            {reminder && <p className='text-success'>{reminder}</p>}
          </div>
        </div>
      </form>
    </div>
  );
};





export const VipinfoModal = ({ isOpen, onRequestClose, vipdata }) => {
  const deletephone = vipdata.phone;
  const [message, setMessage] = useState('');
  const [reminder, setReminder] =useState('');

  console.log(vipdata)
  if (!vipdata){
    return(
      <ErrorPage/>
    );
  }
 // 确认删除
  const deleteClick = () => {
    VipMemberApi.vip({ 
      type: 'delete',
      params: { delete_id: deletephone }
     }).then(res=>{
      console.log("注销会员返回数据",res)
      setReminder(res.message)
      setTimeout(() => {
        setReminder('');
      }, 3000);
     }).catch(error=>{
      if (error.response && error.response.data){
        console.log("错误信息",error.response.data.errormessage);
         setMessage(error.response.data.errormessage);
       }else{
         setMessage(error.message);
       }
     })
  };
// 取消删除
  const cancelClick = () => { onRequestClose() };
  

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      {message ?<span>{message}</span>:
      <div>
      <h2>注销会员信息确认</h2>
      <p>会员一旦注销,不可恢复!请确认好信息.</p>
      {vipdata && <VipDash Results={vipdata} />}
      <button  className="btn btn-primary" onClick={deleteClick}>删除</button> &nbsp;&nbsp;
      <button  className="btn btn-primary" onClick={cancelClick}>取消</button>
      <br/>{reminder && <span className="text-danger">{reminder}</span>}
      </div>}
    </Modal>
  );
};


// 会员注销
export function DeleteVipMemberShip() {
  const [phone, setPhone] = useState('');
  const [vipdata, setVipdata] = useState({});
  const [message, setMessage]=useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const VipHandle=(e)=>{
    setPhone(e.target.value)
  }

  const closeModal = () => {
    setIsModalVisible(false);
};

  async function searchClick() {
      //会员信息
      SearchVipApi.searchvip({
        params: { search_id: phone }
      }).then(data => {
        setVipdata(data.vip)
        setIsModalVisible(true)
      }).then(res => {
        console.log("注销会员返回的VIP数据",res)
      }).catch(error => {
        if (error.response && error.response.data){
         console.log("错误信息",error.response.data.errormessage);
          setMessage(error.response.data.errormessage);
        }else{
          setMessage(error.message);
        }
      });
};

  return (
    <div>
      <div className="row g-0">
        <div className="col-5"></div>
        <div className="col-3">
        <div className="mb-3">
            <label htmlFor="phone" clphone="form-label">注销会员电话号码：</label>
            <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={phone}
                placeholder="请输入注册会员姓名"
                onChange={VipHandle}
            />
        </div>
        <button type="submit" onClick={searchClick}  className="btn btn-primary">搜索</button>
        {message && <p>{message}</p>}
        </div>
      </div>
      {isModalVisible && (
      <VipinfoModal
        isOpen={isModalVisible}
        onRequestClose={closeModal}
        vipdata={vipdata ? vipdata:{}}
        />)}
    </div>
  );
}