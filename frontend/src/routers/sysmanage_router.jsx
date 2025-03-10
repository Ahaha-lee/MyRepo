import { Routes, Route } from 'react-router-dom';
import { PermissionassignmentPage} from '../views/SysManage/Permissions';

export function SysRouter(){
    return(
        <div>
        <Routes>
         <Route path="/permissions_setting" element={<PermissionassignmentPage/>} />
        </Routes>
    </div>
    );  
}