import { useEffect } from "react";
import React from "react";
import { VIPListApi } from "../../api/vip";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { CommonTable } from "../../utils/Common/CommonTable";
import MainLayout from "../../utils/MainLayOut/MainLayout";
import {Pagination} from "../../utils/Common/SlicePage";
export function VIPDashboardPage() {
    return(
        <MainLayout rightContent={<VIPDashForm/>}></MainLayout>
    )
 }
export function VIPDashForm() {
    const [vipsinfo, setVipInfo] =React.useState([]);
    const[pagecount,setPagecount]=useState(1);
    const[vipid,setVipId]=useState(0);
    const [totalNum,setTotalNum ]=useState();
    const navigate = useNavigate();
  

    useEffect(() => {
        getlist();
    }, [pagecount]);
    const getlist = () => {
      VIPListApi.list(
        {
          params:{search_id:vipid,page:pagecount}
        }
      ).then(data => {
              console.log("list返回的数据", data);
              setVipInfo(data.vipinfo);
              setTotalNum(data.total_num);
          }).catch(error => {
              console.error('错误的信息:', error);
          });
  };
  const totalPages=Math.ceil(totalNum/10);

  return (  
    <>
    <div className="mb-3">
        <label htmlFor="phone" className="form-label">查询会员电话号码：</label>
        <input
          type="text"
          className="form-control"
          id="phone"
          name="phone"
          value={vipid}
          placeholder="请输入注册会员号码"
          onChange={(e)=>setVipId(e.target.value)}
        />
            <button type="submit" className="btn btn-primary" onClick={()=>getlist()}>搜索</button>
      </div>
      <div className="mb-3">
        <button className="btn " type="button" onClick={() => navigate('/vip/addvip')}>注册会员</button>
        <button className="btn " type="button" onClick={() => navigate('/vip/deletevip')}>删除会员</button>
      </div>
      {vipsinfo.length>0&&<VIPList Results={vipsinfo}/>}
      <Pagination totalPages={totalPages} onPageChange={setPagecount} />
    </>
  );
}
export function VIPList({Results})
{
  const columns = [
    {
        title: "ID",
        key: "vipid"
    },
    {
        title: "名字",
        key: "name"
    },
    {
        title: "手机号",
        key: "phone"
    },
    {
        title: "注册时间",
        key: "joindate"
    },
    {
        title:"等级",
        key:"gradename"
    },
    {
        title: "可用积分",
        key: "nowpoints"
    },
    {
        title: "消耗积分",
        key: "usedpoints"
    },
    {
      title:"注册人员姓名",
      key:"regihandler"
    },
    {
        title: "操作",
        key: "regihandler"
    }
];

return (
  <>
      <div>
          <CommonTable
          columns={columns}
          data={Results}
          checkable={true}
          // onCheckChange={setPcheckstatus}
          // actions={}
          idField={"vipid"}/>
      </div>
  </>
);
}