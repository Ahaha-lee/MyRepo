import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

import LoginForm from './Components/LoginAndRegister/Login';
import RegisterForm from './Components/LoginAndRegister/Register';
import PsdForgetForm from './Components/LoginAndRegister/PsdForget';
import HomeForm from './Components/Homesettings/Home';
import Payment from './Components/Payments/Payment';
import Points from './Components/MembersToVip/Points';

function App() {
  return (
    <div>
    <Router>
      <Routes>
       <Route path="/register" element={<RegisterForm />} />
       <Route path="/login" element={<LoginForm />} />
       <Route path='/forgetPassword' element={<PsdForgetForm/>}/>
       <Route path='/payment' element={<Payment/>}/>
       <Route path='/vipPoints'element={<Points/>}/>
       <Route path="/" element={<HomeForm />} />
      </Routes>
    </Router>
    </div >
  );
}
export default App;
