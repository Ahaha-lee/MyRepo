import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from './VIews/LoginAndRegister/Login';
import RegisterForm from './VIews/LoginAndRegister/Register';
import PsdForgetForm from './VIews/LoginAndRegister/PsdForget';
import HomeForm from './VIews/Homesettings/Home';
import  { PaymentTocashier } from './VIews/Payments/Payment';
import { Receipts } from './VIews/Payments/Receipt';
import { PointSetForMana } from './VIews/Vip/PointsToManager';
import { PointSetForCash } from './VIews/Vip/PointsToCashier';
import { AddVipMembership ,DeleteVipMemberShip} from './VIews/Vip/VipMemberShip';
import { ApplyForICaiGou } from './VIews/Storage/CaiGouSB';
import { CheckForCaiGou } from './VIews/Storage/CaiGouSH';



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
       <Route path='/addvipmembers' element={<AddVipMembership/>}/>
       <Route path='/deletvipmemers' element={<DeleteVipMemberShip/>}/>

       {/* 采购 */}
       <Route path='/applyforcaigou' element={<ApplyForICaiGou/>}/>
       <Route path='/checkforcaigou' element={<CheckForCaiGou/>}/>
      </Routes>
    </Router>
    </div >
  );
}
export default App;
