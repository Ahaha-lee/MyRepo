//VipQuery.js
import React, { useState } from 'react';
import axios from 'axios';

export function DashtableToPoints({vip_Results}){
    return (
        <div>
             <table>
                        <thead>
                            <tr>
                            <th>会员ID</th>
                            <th>会员姓氏</th>
                            <th>会员名</th>
                            <th>会员电话号码</th>
                            <th>会员可用积分</th>
                            <th>会员消耗积分</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>{vip_Results.VIPID}</td>
                            <td>{vip_Results.FirstName}</td>
                            <td>{vip_Results.LastName}</td>
                            <td>{vip_Results.Phone}</td>
                            <td>{vip_Results.NowPoints}</td>
                            <td>{vip_Results.UsedPoints}</td>
                            </tr>
                        </tbody>
                        </table>
        </div>
    );
}


//查询会员信息
export const SearchVip = () => {
    const [vipphone, setVipPhone] = useState('');
    const [vipData, setVipData] = useState(null);
    const [error, setError] = useState('');

    const handleInputChange = (event) => {
        setVipPhone(event.target.value);
    };

    // async异步函数跟await结合使用
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setVipData(null);

        try {
            const response = await axios.get(`/api/vip?vipphone=${vipphone}`);
            console.log('response',response)
            setVipData(response.data);
        } catch (err) {
            setError('查询失败: ' + (err.response ? err.response.data : err.message));
        }
    };  

    return (
        <div>
            <h1>查询 VIP 信息</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={vipphone}
                    name='searchvipphone'
                    onChange={handleInputChange}
                    placeholder="输入 VIP 电话号码"
                    required
                />
                <button type="submit">查询</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {vipData && (
                <div>
                    {vipData ? (
                        <DashtableToPoints vip_Results={vipData}/>
                        ) : (
                        <p>加载中...</p>
                    )}
                </div>
                            )}
         </div>
        );
};

export const ChangePoints = () => {
  const [points, setPoints] = useState(null);
  const [vipPhone, setVIPPhone] = useState('');
  const [updateNowPoints, setUpdateNowPoints] = useState(false);
  const [updateUsedPoints, setUpdateUsedPoints] = useState(false);
  const [changeResult,setChangeResult] = useState(null);//存储更新后的会员信息
  let type = null;

  const handleChangePoints = async (e) => {
    e.preventDefault(); // 阻止表单的默认提交行为
    setChangeResult(null);

    if (updateNowPoints) {
      type = "add";
    } else if (updateUsedPoints) {
      type = "delete";
    } else {
      return;
    }

    const data = {
      value: points,
      phone: vipPhone,
      updateNowPoints: updateNowPoints,
      updateUsedPoints: updateUsedPoints,
    };

    try {
      const response = await fetch(`/api/vip/${type}?vipphone=${vipPhone}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('网络响应不正常');
      }

      const updateresult = await axios.get(`/api/vip?vipphone=${vipPhone}`);
      setChangeResult(updateresult.data); // 更新状态

    } catch (error) {
      console.log(changeResult)
      console.error('错误:', error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleChangePoints}>
        修改会员积分：
        <input
          type="radio"
          checked={updateNowPoints}
          onChange={() => {
            setUpdateNowPoints(true);
            setUpdateUsedPoints(false);
          }}
        />
        增加

        <input
          type="radio"
          checked={updateUsedPoints}
          onChange={() => {
            setUpdateUsedPoints(true);
            setUpdateNowPoints(false);
          }}
        />
        删除
        <p></p>

        {(updateNowPoints || updateUsedPoints) && (
          <>
            会员电话号码: <input
              type='text'
              name='addvipphone'
              value={vipPhone}
              onChange={(e) => setVIPPhone(e.target.value)}
            /><br />
            {updateNowPoints ? "增加" : "删除"}的积分:<input
              type="number"
              name='addpoints'
              value={points === null ? '' : points}
              onChange={(e) => setPoints(Number(e.target.value))}
            />
            <button type="submit">提交</button>
          </>
        )}
      </form>
      {changeResult&&(
        <div>
          <DashtableToPoints vip_Results={changeResult}/>
        </div>
      )
      }
    </div>
  );
};
