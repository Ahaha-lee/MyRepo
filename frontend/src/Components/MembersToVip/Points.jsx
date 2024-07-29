import React, { useState } from "react";

function Points(){
    const [vipmembers, setVipmembers] = useState([
        {vip_id:1, vipname:'喜羊羊', nowpoints:500, usedpoints:200, phone:'12345678910'},
        {vip_id:2, vipname:'美羊羊', nowpoints:420, usedpoints:300, phone:'22345678910'},
        {vip_id:3, vipname:'沸羊羊', nowpoints:450, usedpoints:100, phone:'32345678910'},
        {vip_id:4, vipname:'懒羊羊', nowpoints:330, usedpoints:220, phone:'42345678910'},
        {vip_id:5, vipname:'暖羊羊', nowpoints:550, usedpoints:100, phone:'52345678910'}
    ]);
    // 查询积分信息
    const [searchvippoints,setsearchvippoints]=useState('');
    const [vip_searchResults,setvip_searchResults]=useState([]);

    // 注意：vipmembers更新
    function handleSeacPointsClick(){
        const results = vipmembers.filter(v => v.vipname.includes(searchvippoints) || v.vip_id.toString().includes(searchvippoints));
        setvip_searchResults(results)
    }
    
    // 增加积分？为什么为什么现有积分不更改
    const [addpoints,setaddpoints]=useState({})

    function handleaddPointsClick(vip_id)
    {
    vip_id = vip_id.toString();
    let pointsToAdd = Number(addpoints[vip_id] || 0);
    setVipmembers(vipmembers.map(vip => {
        if (vip.vip_id.toString() === vip_id) {
            return {...vip, nowpoints: vip.nowpoints + pointsToAdd};
        } else {
            return vip;
        }
    }));
    setaddpoints({...addpoints, [vip_id]: ''})
    }


    return (
        <>
        <div>
        <input type="text" value={searchvippoints} onChange={e =>setsearchvippoints(e.target.value)} ></input>
        <button onClick={handleSeacPointsClick}>查询积分</button><br/>
        <table>
            <tbody>
                {vip_searchResults.map(vip => (
                    <tr key={vip.vip_id}>
                        <td>{vip.vipname}</td>
                        <td>现有积分: {vip.nowpoints}</td>
                        <button type="button" onClick={() => handleaddPointsClick(vip.vip_id)}>增加积分</button>
                        <input type="text" value={addpoints[vip.vip_id] || ''} onChange={e=>setaddpoints({...addpoints, [vip.vip_id]: e.target.value})}></input>
                        <td>已使用积分: {vip.usedpoints}</td>
                        <td>电话: {vip.phone}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
        </>
    );
}

export default Points;
