import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from './views/Login/Login';
import RegisterForm from './views/Login/Register';
import PsdForgetForm from './views/Login/PsdForget';
import HomeForm from './views/Homesettings/Home';
import { UserInfo } from './components/UserInfo';
import ProtectedRoute from './components/ProtectedRoute';
import { AddVipMembership, DeleteVipMemberShip } from './views/Vip/VipMemberShip';
import { ApplyForCaiGou } from './views/Storage/CaiGouSB';
import { CGList } from './views/Storage/CaiGouList';
import { CGListForStaff } from './views/Storage/CGStaffList';
import HomeFormToCGStaff from './views/Homesettings/HomeToCGstaff';
import useSession from './useSession';
import { ProductOutSB } from './views/Storage/OutSB';
import { OutList } from './views/Storage/OutList';
import HomeFormToTallying from './views/Homesettings/HomeToTallyClerk';
import { OutListForStaff } from './views/Storage/OutStaffList';
import {ChangePoints, SearchVip } from './views/Vip/VIPPoints';
import HomeFormToStorage from './views/Homesettings/HomeToStorage';
import { StorageListForCG,StorageListForOut } from './views/Storage/StorageList';
import { ProductOperationList } from './views/Payments/ProductDatainsert';
import { PaymentPuls } from './views/Payments/Payment';
import HomeFormToCashier from './views/Homesettings/HomeToPayment';
import { SupplierOperationList} from './views/Storage/SuppliersOperation';
import { InventorytOperationList } from './views/Storage/InventoryDataSelect';
import { CategoryOPerationList } from './views/Storage/CategoryOperation';
import { DiscountOperationList } from './views/Payments/DiscoutOperation';

const PaymentStaffRoutes = ({ user }) => {
        return (
            <Routes>
                <Route path="/" element={<HomeFormToCashier />} />
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
                <Route path='/payment' element={<ProtectedRoute element={<PaymentPuls/>} allowedRoles={['顶级boss','收银员']} user={user} />} />

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

                {/* 出库管理 */}
                <Route path='/outproducts'
                        element={<ProtectedRoute element={<ProductOutSB />} allowedRoles={['顶级boss','理货员']} user={user} />} />
                 <Route path='/outlist' 
                        element={<ProtectedRoute element={<OutList />} allowedRoles={['顶级boss']} user={user} />} />

                {/* 商品信息操作 */}
                <Route path='/productoperation'
                        element={<ProtectedRoute element={<ProductOperationList />} allowedRoles={['顶级boss']} user={user} />} /> 
      
                {/* 库存信息操作 */}
                <Route path='/inventoryoperation'
                        element={<ProtectedRoute element={<InventorytOperationList/>} allowedRoles={['顶级boss']} user={user} />} /> 
                
                {/* 供应商信息操作 */}
                <Route path='/supplieroperation'
                        element={<ProtectedRoute element={<SupplierOperationList/>} allowedRoles={['顶级boss']} user={user} />} />
              

                {/* 类型信息操作 */}
                <Route path='/categoryoperation'
                        element={<ProtectedRoute element={<CategoryOPerationList/>} allowedRoles={['顶级boss']} user={user} />} />    
                {/* 优惠信息添加 */}
                <Route path='/discountoperation'
                        element={<ProtectedRoute element={<DiscountOperationList/>} allowedRoles={['顶级boss']} user={user} />} />    

            </Routes>
            </div>
        </Router>
    );
}

export default App;
