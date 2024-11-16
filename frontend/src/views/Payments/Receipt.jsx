// import React, { useEffect, useState,useContext} from "react";
// import { Paymentcontext } from './Payment'
// import { TableToReceipt } from "./Payment";
// import { Link } from "react-router-dom";
// export function Receipts(){

//     const [receinewtime,setReceinewtime]=useState(new Date());
//     const { chill, setChill, products, cashiers } = useContext(Paymentcontext);

//     useEffect(()=>{
//         const timer = setInterval(() => {
//             setReceinewtime(new Date())
//         }, 1000);  // （1000毫秒）每秒更新一次时间

//         return () => {
//             clearInterval(timer);
//         };
//     },[]);
//     return(
//         <div>
//             <div>收据</div>
//             <div>结算时间：{receinewtime.toLocaleDateString()} {receinewtime.toLocaleTimeString().slice(0, 5)}</div>
//              <TableToReceipt/>  
//              <div>
//                 <button><Link to='/'>返回首页</Link></button>
//             </div>
//         </div>
//     );
// }
