import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from './Pages/LoginAndRegister/Login';
import RegisterForm from './Pages/LoginAndRegister/Register';
import PsdForgetForm from './Pages/LoginAndRegister/PsdForget';
import HomeForm from './Pages/Homesettings/Home';
import { UserInfo } from './Components/Login/UserInfo';
import ProtectedRoute from './Components/ProtectedRoute';
import { PaymentTocashier } from './Pages/Payments/Payment';
import { Receipts } from './Pages/Payments/Receipt';
import { AddVipMembership, DeleteVipMemberShip } from './Pages/Vip/VipMemberShip';
import { ApplyForICaiGou } from './Pages/Storage/CaiGouSB';
import { CGList } from './Pages/Storage/CaiGouSBList';
import CheckForCaiGou from './Pages/Storage/CaiGouSH';
import HomeFormToCGStaff from './Pages/Homesettings/HomeToCGstaff';
import useSession from './useSession';
import { CaiGouExamine } from './Pages/Storage/Examine';
import { CaiGouReceive } from './Pages/Storage/Receive';
import { ProductOutSB } from './Pages/Storage/OutSB';
import { OutList } from './Pages/Storage/OutList';
import { ProductOutCheck } from './Pages/Storage/OutCheck';
import HomeFormToTallying from './Pages/Homesettings/HomeToTallying';

import HomeFormToPayment from './Pages/Homesettings/HomeToPayment';
import {ChangePoints, SearchVip } from './Pages/Vip/VIPPoints';

const PaymentStaffRoutes = ({ user }) => {
        return (
            <Routes>
                <Route path="/" element={<HomeFormToPayment />} />
            </Routes>
        );
    };
const CGStaffRoutes = ({ user }) => {
        return (
            <Routes>
                <Route path="/" element={<HomeFormToCGStaff />} />
                {/* <Route path='/caigoulistfotcgstaff' 
                       element={<ProtectedRoute element={<CGListForStaff />} allowedRoles={['采购专员']} user={user} />} /> */}
            </Routes>
        );
    };

const TallyingStaffRoutes = ({ user }) => {
        return (
            <Routes>
                <Route path="/" element={<HomeFormToTallying/>} />
                {/* <Route path='/outlistfortallying' 
                       element={<ProtectedRoute element={<OutListTotallying />} allowedRoles={['理货员']} user={user} />} /> */}

            </Routes>
        );
    };
    
function App() {
    const { handleSession, getSession } = useSession();
    const userdata = getSession();
    const [user, setUser] = useState(userdata); // 从 localStorage 获取用户会话

    const updateSession = (updateuserData) => {
        handleSession(updateuserData);
        setUser(updateuserData);
    };
    return (
        <Router>
            <div>
            <UserInfo user={user} />
            <Routes>
                {/* 首页 */}
                <Route path="/" element={<HomeForm allowedRoles={['顶级boss']} />} />
                <Route path='/caigoustaffhome/*' element={<CGStaffRoutes user={user} />} />
                <Route path='/tallyingstaffhome/*' element={<TallyingStaffRoutes user={user} />} />
                <Route path='/paymentstaffhome/*' element={<PaymentStaffRoutes user={user} />} />
                
                {/* 注册登录 */}
                <Route path="/register" element={<RegisterForm allowedRoles={['顶级boss', '采购专员']} />} />
                <Route path="/login" element={<LoginForm handleSession={updateSession} />} />
                <Route path='/forgetPassword' element={<PsdForgetForm allowedRoles={['顶级boss', '采购专员']} />} />

                {/* 收银 */}
                <Route path='/payment' element={<ProtectedRoute element={<PaymentTocashier />} allowedRoles={['顶级boss']} user={user} />} />
                <Route path='/receipt' element={<ProtectedRoute element={<Receipts />} allowedRoles={['顶级boss']} user={user} />} />

                {/* 会员积分管理 */}
                <Route path='/searchvipdata'
                       element={<ProtectedRoute element={<SearchVip/>} allowedRoles={['顶级boss']} user={user}/>}/>
                <Route path='/addvippoints'
                       element={<ProtectedRoute element={<ChangePoints/>} allowedRoles={['顶级boss']} user={user}/>}/>      
                {/* 会员资格管理 */}
                <Route path='/addvipmembers' element={<ProtectedRoute 
                        element={<AddVipMembership />} allowedRoles={['顶级boss','收银员']} user={user} />} />
                <Route path='/deletvipmemers' element={<ProtectedRoute 
                        element={<DeleteVipMemberShip />} allowedRoles={['顶级boss','收银员']} user={user} />} />

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
                 {/* <Route path='/caigoufeedback/:recordid' 
                      element={<ProtectedRoute element={<CGFeedBack />} allowedRoles={['采购专员']} user={user} />} /> */}


               
                <Route path='/outproducts'
                        element={<ProtectedRoute element={<ProductOutSB />} allowedRoles={['顶级boss','理货员']} user={user} />} />
                 <Route path='/outlist' 
                        element={<ProtectedRoute element={<OutList />} allowedRoles={['顶级boss']} user={user} />} />
                <Route path='/checkforoutproducts/:outrecordid'
                        element={<ProtectedRoute element={<ProductOutCheck />} allowedRoles={['顶级boss']} user={user} />} />
                {/* <Route path='/outfeedback/:outrecordid' 
                                element={<ProtectedRoute element={<OutFeedBack/>} allowedRoles={['理货员']} user={user} />} /> */}

                                
            </Routes>
            </div>
        </Router>
    );
}

export default App;
