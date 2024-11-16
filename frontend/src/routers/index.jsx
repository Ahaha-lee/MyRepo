import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import AppPage from '../views/AppPage';

import { LoginPage } from '../views/Login/LoginPlus';
import { HeaderNav } from '../components/HeaderNav';
import { RegisterPage } from '../views/Login/RegisterPlus';
import VIPPage from '../views/Vip/vip';
import StoragePage from '../views/Storage/storage';
import { SiderNav } from '../components/SiderNav';
import { AdminHomePage } from '../views/Homesettings/Home';

export default function AppRouter(){
    return(
        <div>
        <Router>
        <HeaderNav/>
        <SiderNav/>
        <Routes>
            <Route path="/" element={<AppPage/>} />
            
            <Route path='/admin' element={<AdminHomePage/>}/>

            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/register' element={<RegisterPage/>}/>

            {/* vip  */}
            <Route path='/vip/*' element={<VIPPage/>}/> 

            {/* storage */}
            <Route path='/storage/*' element={<StoragePage/>}/>
        </Routes>

        </Router>
        </div>
    );
}