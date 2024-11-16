import { Routes, Route } from 'react-router-dom';
import { AddVipMembership, DeleteVipMemberShip } from '../views/Vip/VipMemberShip';
import { SearchVip } from '../views/Vip/VIPPoints';
import { ChangePoints } from '../views/Vip/VIPPoints';

export function VIPRouter(){
    return(
        <div>
        <Routes>
        {/* 新增会员 */}
            <Route path="/addvip" element={<AddVipMembership/>} /> 
        {/* 注销会员   */}
            <Route path="/deletevip" element={<DeleteVipMemberShip/>} /> 
        {/* 查询会员 */}
            <Route path="/searchvip" element={<SearchVip/>} />  
        {/* 修改积分 */}
            <Route path="/changepoints" element={<ChangePoints/>} />  

        </Routes>
    </div>
    );
}