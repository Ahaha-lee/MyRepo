import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginForm from './Components/LoginAndRegister/Login';
import RegisterForm from './Components/LoginAndRegister/Register';
import PsdForgetForm from './Components/LoginAndRegister/PsdForget';

function App() {
  return (
    <div>
    <Router>
      <Routes>
       <Route path="/Register" element={<RegisterForm />} />
       <Route path="/Login" element={<LoginForm />} />
       <Route path='/ForgetPassword' element={<PsdForgetForm/>}/>
       <Route path="/" element={<LoginForm />} />
      </Routes>
    </Router>
    </div >
  );
}
export default App;
