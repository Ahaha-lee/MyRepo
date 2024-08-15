import React, { useState} from "react";
import { Link } from "react-router-dom";
import { getLocalStorage,setLocalStorage} from "../../utils/storageways";
import { VIPKEY } from "../../mock";
import { changeVIP } from "../../utils/vip";

export default function PointsSettings() {
    return (
        <>
            <div>
                <CheckPoints />
            </div>
            <div>
                <AddPoints/>
            </div>
            <div>
                <DeletePoints/>
            </div>
            <div>
                <button><Link to='/'>返回首页</Link></button>
            </div>
        </>
    );
}

export function DashtableToPoints({vip_Results}){
    return (
        <div>
             <table>
                <tbody>
                 {vip_Results.map(vip => (
                     <tr key={vip.vip_id}>
                        <td>{vip.vipname}</td>
                        <td>现有积分: {vip.nowpoints}</td>
                        <td>已使用积分: {vip.usedpoints}</td>
                        <td>电话:{vip.phone}</td>
                     </tr>           
                     ))}
                </tbody>
            </table>   
        </div>
    );
}


export function CheckPoints(){
    const [searchvippoints, setsearchvippoints] = useState(''); // 初始化为空字符串,类似于这种的状态，context怎么办
    const [vip_CheckResults, setvip_CheckResults] = useState([]);
    const initialvip = getLocalStorage(VIPKEY, true);

    function handleSeacPointsClick() {
        const result = initialvip.filter(
            v => v.phone === searchvippoints || 
            v.vip_id.toString() === searchvippoints||
            v.vipname === searchvippoints );
        if(result){
            setvip_CheckResults(result);
            console.log(vip_CheckResults)
        }
        else{
            alert('会员不存在')
        }
    }

    function handleSearchCheck(event) {
        setsearchvippoints(event.target.value)
    }

    console.log(initialvip)
    return (
        <div>
            积分查询<br/>
            <input type="text" value={searchvippoints} onChange={handleSearchCheck}></input>
            <button onClick={handleSeacPointsClick}>查询积分</button><br />
            <DashtableToPoints vip_Results={vip_CheckResults}/>
        </div>
    );
}

export function AddPoints() {

    const [addPoints,setaddPoints] =useState()//增加的积分
    const [vipIdToAddPoints,setVipIdToAddPoints]=useState('')//存储增加积分输入框输入
    const initialvip = getLocalStorage(VIPKEY, true);
    const [vip_AddResults,setVip_AddResults]=useState([]);

    function handleAddPointsClick(){
        const memberToUpdate = initialvip.filter(
            v=>v.vipname===vipIdToAddPoints ||
            v.phone===vipIdToAddPoints);
            console.log(memberToUpdate);
            if (memberToUpdate.length > 0) {
                for(const item of initialvip) {
                    const member = memberToUpdate.find(member => member.vip_id === item.vip_id);
                    if (member) {
                        const addVipdate= { ...item, nowpoints: item.nowpoints + addPoints };
                        console.log(addVipdate);
                        changeVIP(item.id, addVipdate)
                        setVip_AddResults((prestate) => [addVipdate])
                        break;                      
                    }
                }
                alert('积分添加成功');
            } else {
                alert('未找到匹配会员');
            }
            
    }
    function handleSearchAdd(event) {
        setVipIdToAddPoints(event.target.value)
    }
    return (
        <>
            <div>
                增加积分<br/>
                <input type="text" value={vipIdToAddPoints} onChange={handleSearchAdd} ></input>
                <input type="number" value={addPoints} placeholder="输入要添加的积分"
                 onChange={e => {
                    const num=Number(e.target.value);
                    if(!isNaN(num) && num>0)
                    {
                        setaddPoints(num)
                    }
                    else{
                        alert('输入的积分数应为正整数')
                    }
                }}></input>
                <button onClick={handleAddPointsClick}>增加积分</button><br />
                <DashtableToPoints vip_Results={vip_AddResults}/>
            </div>
        </>
    );
}



export function DeletePoints() {
    const [deletePoints, setDeletePoints] = useState(0);
    const [vipIdToDeletePoints, setVipIdToDeletePoints] = useState('');
    const initialvip = getLocalStorage(VIPKEY, true);
    const [vip_DeleResults,setVip_DeleResults]=useState([]);

    function handleDeletePointsClick() {
        const deleteToUpdate =initialvip.filter(
            v => v.vipname === vipIdToDeletePoints || v.phone === vipIdToDeletePoints
        );
    
        if (deleteToUpdate.length > 0) {
            for (const item of initialvip) {
                const de_member = deleteToUpdate.find(de_member => de_member.vip_id === item.vip_id);
                if (de_member) {
                    // console.log("Current item before deletion:", item); 
                    // console.log("Delete points:", deletePoints); 
    
                    if (item.nowpoints >= deletePoints) {
                        const deletedVipdate = { ...item, nowpoints: item.nowpoints - deletePoints };
                        // console.log("Deleted VIP data:", deletedVipdate); // 调试输出，查看更新后的会员信息
                        changeVIP(item.id, deletedVipdate);
                        setVip_DeleResults((prestate) => [deletedVipdate]);
                        alert('积分删除成功');
                        break;
                    } else {
                        alert('积分不足');
                    }

                }
                else {
                    alert('未找到匹配会员');
                }
                }
            }
    }
    
    return (
        <>
            <div>
                删除积分<br/>
                
                <input type="text" value={vipIdToDeletePoints} onChange={e => setVipIdToDeletePoints(e.target.value)} ></input>
                <input type="number" value={deletePoints} placeholder="输入消费的积分"
                onChange={e => {
                            const num=Number(e.target.value);
                            if(num>0)
                            {
                                setDeletePoints(num)
                            }
                            else{
                                alert('输入的积分数应为整数')
                            }
                            }} ></input>
                <button onClick={handleDeletePointsClick}>删除积分</button><br />
                <DashtableToPoints vip_Results={vip_DeleResults}/>
            </div>
            </>
   );
}
