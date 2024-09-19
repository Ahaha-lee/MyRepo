// import React from 'react';
// import {  OUTCHECKREKEY } from "../../Mock/inventoryMock";
// import { getLocalStorage } from "../../utils/storageways";

// // 理货员账号下的出库申报表进度查询功能 在list的选项里面，采购和出库的进度查询都要在细化一下 我想的事这个跟顶级boss看的一样 不想多写了
// export function OutFeedBack() {
//     const CheckResultArray = getLocalStorage(OUTCHECKREKEY, true);
//     const session = getLocalStorage('session', true);

//     if (!CheckResultArray || CheckResultArray.length === 0) {
//         console.log("CheckResultArray is empty or undefined");
//         return <div>没有找到任何记录。</div>;
//     }

//     if (!session || !session.staffId) {
//         console.log("Session is empty or staffId is undefined");
//         return <div>会话信息无效。</div>;
//     }

//     console.log("CheckResultArray length:", CheckResultArray.length);

//     const feedbacks = []; // 用于存储匹配的反馈
    

//     for (let i = 0; i < CheckResultArray.length; i++) {
//         console.log("Current index:", i);
//         console.log("Checking staffId:", CheckResultArray[i].getProductStaffId, "against session staffId:", session.staffId);
        
//         if (CheckResultArray[i].getProductStaffId === session.staffId) {
//             feedbacks.push(
//                 <div key={CheckResultArray[i].outrecordid}>
//                     <h3>审核反馈</h3>
//                     <p>申报记录编号: {CheckResultArray[i].outrecordid}</p>
//                     <p>申报表申请人姓名: {CheckResultArray[i].getProductStaffName}</p>
//                     <p>申报表申请人编号: {CheckResultArray[i].getProductStaffId}</p>
//                     <p>审核负责人编号: {CheckResultArray[i].checkId}</p>
//                     <p>是否批准该申报: {CheckResultArray[i].checkResult}</p>
//                     <p>审核意见: {CheckResultArray[i].Checkopinion}</p>
//                     <p>审核时间：{CheckResultArray[i].checkTime}</p>
//                 </div>
//             );
//         }
//     }

//     if (feedbacks.length === 0) {
//         return <div>没有找到匹配的审核反馈。</div>;
//     }

//     return <div>{feedbacks}</div>;
// }