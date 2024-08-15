import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from './Components/LoginAndRegister/Login';
import RegisterForm from './Components/LoginAndRegister/Register';
import PsdForgetForm from './Components/LoginAndRegister/PsdForget';
import HomeForm from './Components/Homesettings/Home';
import  { PaymentTocashier } from './Components/Payments/Payment';
import { Receipts } from './Components/Payments/Receipt';
import { ManageToAddVip } from './Components/Vip/VipMemberShip';
import { PointSetForMana } from './Components/Vip/PointsToManager';
import { PointSetForCash } from './Components/Vip/PointsToCashier';



function App() {
  return (
    <div>
    <Router>
      <Routes>
        {/* 首页 */}
      <Route path="/" element={<HomeForm />} />

      {/* 注册登录 */}
       <Route path="/register" element={<RegisterForm />} />
       <Route path="/login" element={<LoginForm />} />
       <Route path='/forgetPassword' element={<PsdForgetForm/>}/>

      {/* 收银 */}
       <Route path='/payment' element={<PaymentTocashier/>}/>
       <Route path='/receipt' element={<Receipts/>}/>

      {/* 会员 */}
       <Route path='/pointsformanager'element={<PointSetForMana/>}/>
       <Route path='/pointsforcashier' element={<PointSetForCash/>}/> 
       <Route path='/addvipmembers' element={<ManageToAddVip/>}/>
       
       {/* <Route path='/deletvipmemers' element={}/> */}
      </Routes>
    </Router>
    </div >
  );
}
export default App;
