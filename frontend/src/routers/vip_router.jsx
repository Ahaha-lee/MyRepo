import { Routes, Route } from 'react-router-dom';
import { AddVipPage, DeleteVipPage } from '../views/Vip/VipMemberShip';
import { ChangePointsPage } from '../views/Vip/VIPPoints';
import React from 'react';
import { VIPDashboardPage } from '../views/Vip/VIPInfoDash';
import { GradRulePage } from '../views/Vip/VIPGradeRule';
export function VIPRouter(){
    return(
        <div>
        <Routes>
         <Route path="/points" element={<ChangePointsPage/>} />

         <Route path="/info" element={<VIPDashboardPage/>} />

        {/* 新增会员 */}
            <Route path="/addvip" element={<AddVipPage/>} /> 
        {/* 注销会员   */}
            <Route path="/deletevip" element={<DeleteVipPage/>} />  
        
        <Route path="/setgrade" element={<GradRulePage/>} />
        {/* 修改积分 */}
            <Route path="/changepoints" element={<ChangePointsPage/>} />  

        </Routes>
    </div>
    );
}