import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from './Pages/LoginAndRegister/Login';
import RegisterForm from './Pages/LoginAndRegister/Register';
import PsdForgetForm from './Pages/LoginAndRegister/PsdForget';
import HomeForm from './Pages/Homesettings/Home';
import { UserInfo } from './Components/Login/UserInfo';
import ProtectedRoute from './Components/ProtectedRoute';
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
import {ChangePoints, SearchVip } from './Pages/Vip/VIPPoints';
import HomeFormToStorage from './Pages/Homesettings/HomeToStorage';
import { StorageListForCG,StorageListForOut } from './Pages/Storage/StorageList';
import { Productinfoinsert } from './Pages/Payments/ProductDatainsert';
import { ProductinfoDelete } from './Pages/Payments/ProductDelete';
import { ProductOperationList } from './Pages/Payments/ProductDatainsert';
import { ProductinfoSelect } from './Pages/Payments/ProductSelect';
import { PaymentPuls } from './Pages/Payments/PaymentPlus';
import { InventoryinfoSelect } from './Pages/Storage/InventoryDataSelect';
import { InventoryDataUpdate } from './Pages/Storage/InventoryUpdate';
import { ProductDataUpdate } from './Pages/Payments/ProductUpdate';
import HomeFormToCashier from './Pages/Homesettings/HomeToPayment';
import { SupplierinfoDelete, SupplierInfoinsert, SupplierInfoselect, SupplierInfoUpdate,SupplierOperationList} from './Pages/Storage/SuppliersOperation';
import { InventorytOperationList } from './Pages/Storage/InventoryDataSelect';
import { Categoryinfoinsert, CategoryOPerationList } from './Pages/Storage/CategoryOperation';
import { DiscountOperationList } from './Pages/Payments/DiscoutOperation';

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
