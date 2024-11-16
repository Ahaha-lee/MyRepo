import { Router } from "express";
import { Routes } from "react-router-dom";


export default function StorageRouter(){
    return (
        <div>
            <Routes>
                <Router to="/storage/cg/*" elment={<CaiGouRouter/>}>采购</Router>
                <Router>出库</Router>
            </Routes>
        </div>
    );
}


export function CaiGouRouter(){
     // return(
    //     <div>
    //     <Routes>
    //     {/* 采购申请 */}
    //         <Route path="/cgsb" element={</>} /> 
    //     {/* 采购审核 */}
    //         <Route path="/cgsh" element={</>} /> 
    //     {/* 采购入库 */}
    //         <Route path="/cgrk" element={</>} /> 
    //     {/* 采购验收 */}
    //         <Route path="/cgys" element={</>} /> 

    //     </Routes>
    //     </div>
    // )
}