import React from 'react';
import { CHECKRESULTKEY } from "../../Mock/inventoryMock";
import { getLocalStorage } from "../../utils/storageways";

export function CGFeedBack() {
    const CheckResultArray = getLocalStorage(CHECKRESULTKEY, true);
    const session = getLocalStorage('session', true);

    if (!CheckResultArray || CheckResultArray.length === 0) {
        console.log("CheckResultArray is empty or undefined");
        return <div>没有找到任何记录。</div>;
    }

    if (!session || !session.staffId) {
        console.log("Session is empty or staffId is undefined");
        return <div>会话信息无效。</div>;
    }

    console.log("CheckResultArray length:", CheckResultArray.length);

    const feedbacks = []; // 用于存储匹配的反馈

    for (let i = 0; i < CheckResultArray.length; i++) {
        console.log("Current index:", i);
        console.log("Checking staffId:", CheckResultArray[i].applystaffId, "against session staffId:", session.staffId);
        
        if (CheckResultArray[i].applystaffId === session.staffId) {
            feedbacks.push(
                <div key={CheckResultArray[i].recordid}>
                    <h3>审核反馈</h3>
                    <p>申报记录编号: {CheckResultArray[i].recordid}</p>
                    <p>申报表申请人姓名: {session.username}</p>
                    <p>申报表申请人编号: {CheckResultArray[i].applystaffId}</p>
                    <p>审核负责人编号: {CheckResultArray[i].checkId}</p>
                    <p>是否批准该申报: {CheckResultArray[i].checkResult}</p>
                    <p>审核意见: {CheckResultArray[i].approvalopinion}</p>
                    <p>审核时间：{CheckResultArray[i].checkTime}</p>
                    <p>该申报商品是否入库：{CheckResultArray[i].putinResult}</p>
                    <p>入库时间：{CheckResultArray[i].putinTime}</p>
                    <p>该申报商品是否通过验收：{CheckResultArray[i].examineResult}</p>
                    <p>验收意见：{CheckResultArray[i].acceptanceOpinion}</p>
                    <p>验收时间：{CheckResultArray[i].examineTime}</p>
                </div>
            );
        }
    }

    if (feedbacks.length === 0) {
        return <div>没有找到匹配的审核反馈。</div>;
    }

    return <div>{feedbacks}</div>;
}
