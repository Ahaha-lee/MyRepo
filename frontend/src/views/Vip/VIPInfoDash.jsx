import { useEffect } from "react";
import React from "react";
import { VIPListApi } from "../../api/vip";
import { VipDash } from "./dashtable";
import { useState } from 'react';
import { SearchVipApi} from '../../api/vip'; 
import { useNavigate } from "react-router-dom";

export const SearchVip = () => {
    const [phone, setPhone] = useState('');
    const [vipdata, setVipdata] = useState({});
    const [message, setMessage] = useState('');
  
    const VipHandle = (e) => {
      setPhone(e.target.value);
    };
  
    async function searchClick() {
      try {
        const response = await SearchVipApi.searchvip({
          params: { search_id: phone }
        });
        setVipdata(response.vip);
        console.log("查询会员返回的VIP数据", response.vip);
        setMessage(''); 
      } catch (error) {
        console.log("错误信息", error.response.data);
        if (error.response && error.response.data) {
          console.log("错误信息", error.response.data.errormessage);
          setMessage(error.response.data.errormessage);
        } else {
          setMessage(error.message);
        }
      }
    }
  
    return (
      <div>
        <div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">查询会员电话号码：</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={phone}
                placeholder="请输入注册会员号码"
                onChange={VipHandle}
              />
            </div>
            <button type="submit" onClick={searchClick} className="btn btn-primary">搜索</button>
            {message && <p><span className="text-danger">{message}</span></p>}
          </div>
        </div>
    );
  }



export function VIPDashForm() {
    const [vipsinfo, setVipInfo] =React.useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getlist = () => {
            VIPListApi.list()
                .then(data => {
                    console.log("list返回的数据", data);
                    setVipInfo(data.vipinfo);
                })
                .catch(error => {
                    console.error('错误的信息:', error);
                });
        };

        getlist();
    }, []); 


    return (
        <>
            <div>
            <div className="mb-3">
                     <SearchVip/>
            </div>
            <div className="mb-3">
              <button className="btn " type="button" onClick={() => navigate('/vip/addvip')}>注册会员</button>
              <button className="btn " type="button" onClick={() => navigate('/vip/deletevip')}>删除会员</button>
            </div>
                    <hr></hr>
            <div>
                {vipsinfo.length > 0 && <VipDash Results={vipsinfo}/>}
            </div>
           </div>
        </>
    );
}
