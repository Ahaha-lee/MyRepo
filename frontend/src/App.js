import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from './VIews/LoginAndRegister/Login';
import RegisterForm from './VIews/LoginAndRegister/Register';
import PsdForgetForm from './VIews/LoginAndRegister/PsdForget';
import HomeForm from './VIews/Homesettings/Home';
import { UserInfo } from './Components/Login/UserInfo';
import ProtectedRoute from './Components/ProtectedRoute';
import { PaymentTocashier } from './VIews/Payments/Payment';
import { Receipts } from './VIews/Payments/Receipt';
import { PointSetForMana } from './VIews/Vip/PointsToManager';
import { PointSetForCash } from './VIews/Vip/PointsToCashier';
import { AddVipMembership, DeleteVipMemberShip } from './VIews/Vip/VipMemberShip';
import { ApplyForICaiGou } from './VIews/Storage/CaiGouSB';
import { CGList } from './VIews/Storage/CaiGouSBList';
import { CheckForCaiGou } from './VIews/Storage/CaiGouSH';
import HomeFormToCGStaff from './VIews/Homesettings/HomeToCGstaff';
import useSession from './useSession';
import { CGFeedBack } from './VIews/Storage/CaiGouFeedback';
import { CaiGouExamine } from './VIews/Storage/Examine';
import { CaiGouReceive } from './VIews/Storage/Receive';
import { SearchRecord } from './VIews/Storage/Searchrecord';
import { CGListForStaff } from './VIews/Storage/SBListForCGStaff';

const CGStaffRoutes = ({ user }) => {
    return (
        <Routes>
            <Route path="/" element={<HomeFormToCGStaff />} />
            <Route 
                path="/cgcheckfeedback" 
                element={<ProtectedRoute element={<CGFeedBack />} allowedRoles={['采购专员']} user={user} />} 
            />
        </Routes>
    );
};

function App() {
    const { handleSession, getSession } = useSession();
    const [user, setUser] = useState(getSession()); // 从 localStorage 获取用户会话

    const updateSession = (userData) => {
        handleSession(userData);
        setUser(userData);
    };

    return (
        <Router>
            <div>
            <UserInfo user={user} />
            <Routes>
                {/* 首页 */}
                <Route path="/" element={<HomeForm allowedRoles={['顶级boss']} />} />
                <Route path='/caigoustaffhome/*' element={<CGStaffRoutes user={user} />} />
                
                {/* 注册登录 */}
                <Route path="/register" element={<RegisterForm allowedRoles={['顶级boss', '采购专员']} />} />
                <Route path="/login" element={<LoginForm handleSession={updateSession} />} />
                <Route path='/forgetPassword' element={<PsdForgetForm allowedRoles={['顶级boss', '采购专员']} />} />

                {/* 收银 */}
                <Route path='/payment' element={<ProtectedRoute element={<PaymentTocashier />} allowedRoles={['顶级boss']} user={user} />} />
                <Route path='/receipt' element={<ProtectedRoute element={<Receipts />} allowedRoles={['顶级boss']} user={user} />} />

                {/* 会员管理 */}
                <Route path='/pointsformanager' 
                        element={<ProtectedRoute element={<PointSetForMana />} allowedRoles={['顶级boss']} user={user} />} />
                <Route path='/pointsforcashier' element={<ProtectedRoute 
                        element={<PointSetForCash />} allowedRoles={['顶级boss']} user={user} />} />
                <Route path='/addvipmembers' element={<ProtectedRoute 
                        element={<AddVipMembership />} allowedRoles={['顶级boss']} user={user} />} />
                <Route path='/deletvipmemers' element={<ProtectedRoute 
                        element={<DeleteVipMemberShip />} allowedRoles={['顶级boss']} user={user} />} />

                {/* 采购管理 */}
                <Route path='/applyforcaigou' 
                        element={<ProtectedRoute element={<ApplyForICaiGou />} allowedRoles={['顶级boss', '采购专员']} user={user} />} />
                <Route path='/checkforcaigou/:recordid' 
                        element={<ProtectedRoute element={<CheckForCaiGou />} allowedRoles={['顶级boss']} user={user} />} />
                <Route path='/acceptanceforcaigou/:recordid'
                        element={<ProtectedRoute element={<CaiGouExamine />} allowedRoles={['顶级boss']} user={user} />} />
                 <Route path='/putinforcaigou/:recordid'
                        element={<ProtectedRoute element={<CaiGouReceive />} allowedRoles={['顶级boss','采购专员']} user={user} />} />
                <Route path='/caigoulist' 
                        element={<ProtectedRoute element={<CGList />} allowedRoles={['顶级boss']} user={user} />} />
                <Route path='/caigoulistfotcgstaff' 
                        element={<ProtectedRoute element={<CGListForStaff/>} allowedRoles={['顶级boss','采购专员']} user={user} />} />  
                <Route path='/caigousearch'
                        element={<ProtectedRoute element={<SearchRecord />} allowedRoles={['顶级boss']} user={user} />} />
                
            </Routes>
            </div>
        </Router>
    );
}

export default App;
