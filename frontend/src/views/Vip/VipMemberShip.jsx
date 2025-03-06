import { useState, useEffect} from "react";
import { getLocalStorage } from "../../components/localstorage";
import { SearchVipApi, VipGrade, VipMemberApi } from "../../api/vip";
import Modal from 'react-modal';
import { ErrorPage } from "../Employees/error";
import { AVipDash } from "./dashtable";
import React from "react";
import MainLayout from '../../utils/MainLayOut/MainLayout'

export function AddVipPage (){
  return(
    <div>
      <MainLayout rightContent={<AddVipMembership/>}></MainLayout>
    </div>
  )
}
export const AddVipMembership = () => {
  const [message, setMessage] = useState('');  // 错误信息
  const [reminder, setReminder] = useState(''); // 提醒消息
  const handler = getLocalStorage('session', true).name;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gradeId, setGradeId] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    getOptions();
  }, []); 

  const handleSubmit = (e) => {
    e.preventDefault();
    VipMemberApi.vip({
      type: 'add',
      data: {
        Name: name,
        Phone: phone,
        RegiHandler: handler,
        Grade: gradeId
      },
    }).then(res => {
      console.log("注册会员返回数据", res);
      setReminder(res.message);
      setTimeout(() => {
        setReminder('');
      }, 3000);
    }).catch(error => {
      if (error.response && error.response.data) {
        console.log("错误信息", error.response.data.errormessage);
        setMessage(error.response.data.errormessage);
      } else {
        setMessage(error.message);
      }
    });
  };

  const getOptions = async () => {
    try {
      const res = await VipGrade.get({
        params: {}
      });
      const data = res.data;
      const grades = data.map(item => ({
        GradeId: item.GradeId,
        GradeName: item.GradeName
      }));
      setOptions(grades);
    } catch (error) {
      console.error('grades请求错误:', error);
    }
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
        <div>
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
              type="tel" 
              className="form-control"
              id="phone"
              name="phone"
              value={phone}
              placeholder="请输入会员手机号码"
              onChange={VipHandle}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="dropdown" className="form-label">请选择会员等级:</label>
            <select 
              id="dropdown" 
              className="form-select" 
              value={gradeId} 
              onChange={(e) => setGradeId(e.target.value)}
            >
              {options.length > 0 ? (
                options.map((option, index) => (
                  <option key={index} value={option.GradeId} className="form-option">
                    {option.GradeName}
                  </option>
                ))
              ) : (
                <option disabled>还未设置等级规则，请先设置等级规则</option>
              )}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">提交</button>
          {message && <p className="text-danger">{message}</p>}
          {reminder && <p className='text-success'>{reminder}</p>}
        </div>
      </form>
    </div>
  );
};


export function DeleteVipPage(){
  return(
    <div>
      <MainLayout rightContent={<DeleteVipMemberShip/>}></MainLayout>
    </div>
  )
} 




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
      {vipdata && <AVipDash Results={vipdata} />}
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
      <div>
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
      {isModalVisible && (
      <VipinfoModal
        isOpen={isModalVisible}
        onRequestClose={closeModal}
        vipdata={vipdata ? vipdata:{}}
        />)}
    </div>
  );
}