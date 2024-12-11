import { Routes, Route } from 'react-router-dom';
import { AddVipPage, DeleteVipMemberShip, DeleteVipPage } from '../views/Vip/VipMemberShip';
import { ChangePointsPage } from '../views/Vip/VIPPoints';
import React from 'react';
import { MembersPage, PointsPage, VIPDashboardPage } from '../views/Vip/vip';
export function VIPRouter(){
    return(
        <div>
        <Routes>
         <Route path="/members" element={<MembersPage/>} />
         <Route path="/points" element={<ChangePointsPage/>} />

         <Route path="/info" element={<VIPDashboardPage/>} />

        {/* 新增会员 */}
            <Route path="/addvip" element={<AddVipPage/>} /> 
        {/* 注销会员   */}
            <Route path="/deletevip" element={<DeleteVipPage/>} />  
        


        {/* 修改积分 */}
            <Route path="/changepoints" element={<ChangePointsPage/>} />  

        </Routes>
    </div>
    );
}