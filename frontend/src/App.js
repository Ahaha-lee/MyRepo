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
import { ApplyForCaiGou } from './Pages/Storage/CaiGouSB';
import { CGList } from './Pages/Storage/CaiGouList';
import { CGListForStaff } from './Pages/Storage/CGStaffList';
import HomeFormToCGStaff from './Pages/Homesettings/HomeToCGstaff';
import useSession from './useSession';
import { ProductOutSB } from './Pages/Storage/OutSB';
import { OutList } from './Pages/Storage/OutList';
import HomeFormToTallying from './Pages/Homesettings/HomeToTallyClerk';
import { OutListForStaff } from './Pages/Storage/OutStaffList';
import HomeFormToPayment from './Pages/Homesettings/HomeToPayment';
import {ChangePoints, SearchVip } from './Pages/Vip/VIPPoints';
import HomeFormToStorage from './Pages/Homesettings/HomeToStorage';
import { StorageListForCG,StorageListForOut } from './Pages/Storage/StorageList';

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
                <Route path='/cgistforcgstaff' 
                       element={<ProtectedRoute element={<CGListForStaff />} allowedRoles={['采购专员']} user={user} />} />
            </Routes>
        );
    };
const StorageStaffRoutes = ({ user }) => {
        return (
            <Routes>
                <Route path="/" element={<HomeFormToStorage />} />
                <Route path='/cgistforstorstaff' 
                       element={<ProtectedRoute element={<StorageListForCG/>} allowedRoles={['仓库管理员']} user={user} />} />
            <Route path='/outistforstorstaff' 
                       element={<ProtectedRoute element={<StorageListForOut/>} allowedRoles={['仓库管理员']} user={user} />} />
            </Routes>
        );
    };

const TallyingStaffRoutes = ({ user }) => {
        return (
            <Routes>
                <Route path="/" element={<HomeFormToTallying/>} />
                <Route path='/outlistfortallyclerk' 
                       element={<ProtectedRoute element={<OutListForStaff />} allowedRoles={['理货员']} user={user} />} />

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
                <Route path='/storagestaffhome/*' element={<StorageStaffRoutes user={user}/>}/>
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
                        element={<ProtectedRoute element={<ApplyForCaiGou />} allowedRoles={['顶级boss', '采购专员']} user={user} />} />
                <Route path='/caigoulist' 
                         element={<ProtectedRoute element={<CGList />} allowedRoles={['顶级boss']} user={user} />} /> 
               
                {/* <Route path='/cgparticulars/:recordid' 
                        element={<ProtectedRoute element={<CGParticulars />} allowedRoles={['顶级boss']} user={user} />} /> */}
                 {/* <Route path='/caigoufeedback/:recordid' 
                      element={<ProtectedRoute element={<CGFeedBack />} allowedRoles={['采购专员']} user={user} />} /> */}


               
                <Route path='/outproducts'
                        element={<ProtectedRoute element={<ProductOutSB />} allowedRoles={['顶级boss','理货员']} user={user} />} />
                 <Route path='/outlist' 
                        element={<ProtectedRoute element={<OutList />} allowedRoles={['顶级boss']} user={user} />} />
                {/* <Route path='/checkforoutproducts/:recordid'
                        element={<ProtectedRoute element={<ProductOutCheck />} allowedRoles={['顶级boss']} user={user} />} /> */}
                {/* <Route path='/outfeedback/:outrecordid' 
                                element={<ProtectedRoute element={<OutFeedBack/>} allowedRoles={['理货员']} user={user} />} /> */}

                                
            </Routes>
            </div>
        </Router>
    );
}

export default App;
