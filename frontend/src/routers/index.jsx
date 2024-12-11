import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import AppPage from '../views/AppPage';

import { LoginPage } from '../views/Login/LoginPlus';
import { RegisterPage } from '../views/Login/RegisterPlus';
import { AdminHomePage } from '../views/Homesettings/Home';
import { VIPRouter } from './vip_router';
import { StorageRouter } from './storage_router';
export default function AppRouter(){

    return(
        <div>
        <Router>

        <Routes>
            <Route path="/" element={<AppPage/>} />
            
            <Route path='/admin' element={<AdminHomePage/>}/>

            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/register' element={<RegisterPage/>}/>

            {/* vip  */}
            <Route path='/vip/*' element={<VIPRouter/>}/>

            {/* storage */}
            <Route path='/storage/*' element={<StorageRouter/>}/>
        </Routes>

        </Router>
        </div>
    );
}