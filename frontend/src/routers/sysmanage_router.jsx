import { Routes, Route } from 'react-router-dom';
import Permissions from '../views/SysManage/Permissions';

export function SysRouter(){
    return(
        <div>
        <Routes>
         <Route path="/permissions_setting" element={<Permissions/>} />
        </Routes>
    </div>
    );  
}