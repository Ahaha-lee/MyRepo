// // 导入:props数据传递有问题
// // 直接从local Storage获取,也是数据(状态)共享的问题
// export function PointSetForCash(){
   
//     const getMembers=()=>{

//         if(!localStorage.getItem('initialvip')){
//             return null;
//         }
//         else{
//             return 
//         }
//     }
// }

import { CheckPoints} from "./Points";

 export function PointSetForCash(){
    return (
        <>
        <CheckPoints/>
        </>
    );
 }