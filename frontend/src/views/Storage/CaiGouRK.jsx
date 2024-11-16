import React, { useState } from 'react';
import Modal from 'react-modal';
import useSession from '../../useSession';
import { ShowDetails } from './CaiGouSH';
import { useEffect } from 'react';



// 这个操作只有顶级boss和仓库管理员可操作

// 确认审核是否通过？
// 通过才可进行此操纵
export function RKShowDetails({checkdata}){
    console.log(checkdata)
    return(
        <div>
            <strong>审核人员id：{checkdata.checkstaffid}</strong><br/>
            <strong>审核结果：{checkdata.checkresult}</strong><br/>
            <strong>审核意见：{checkdata.checkopinion}</strong><br/>
            <strong>审核时间：{checkdata.checkDate}</strong> <br/>
        </div>
    );
}

export const PutinModal = ({ isOpen, onRequestClose, procureDetails, onSubmit, state, laststate }) => {
    console.log(procureDetails)
    const [putinQuantities, setPutinQuantities] = useState(0); // 初始值为 0
    const [putinResult, setPutinResult] = useState("通过");
    const [putinOpinion, setPutinOpinion] = useState("");
    const [recordDetails, setRecordDetails] = useState();
    const [error, setError] = useState(null);
    const { getSession } = useSession();
    const handler = getSession();

    useEffect(() => {
        if (isOpen && procureDetails && procureDetails.recordID) {
            fetchRecordDetails(procureDetails.recordID);
        }
    }, [isOpen, procureDetails]);

    useEffect(() => {
        // 在 procureDetails 更新时设置 putinQuantities
        if (procureDetails && procureDetails.cGQuantity) {
            setPutinQuantities(parseFloat(procureDetails.cGQuantity) || 0);
        }
    }, [procureDetails]);

    const fetchRecordDetails = async (recordid) => {
        try {
            const response = await fetch(`/api/storage/operationinfo?action=check&recordID=${recordid}`);
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            const data = await response.json();
            setRecordDetails(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = () => {

        const putinData = {
            StorehouseStaffID: handler.EmployeeID,
            PutINResult: putinResult,
            PutinOpinion: putinOpinion,
            PutInQuantities: putinQuantities, 
            PutInDate: "2024-01-01 00:00:00",
        };

        onSubmit(putinData,putinResult);
    };
      // 计算按钮是否禁用的逻辑
      const isDisabled = state || 
      laststate === "不通过" || 
      laststate === "" || 
      laststate === null || 
      laststate===undefined;
    

    // 计算按钮标题的逻辑
    const title = state ? "验收已完成，不可重复审核。" :
    laststate === "不通过" ? "审核未通过，不可进行入库操作" :
    laststate === ""||null||undefined ? "还未审核，不可入库" :  
    "";
   console.log(state)
   console.log(laststate)
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <h2>入库确认</h2>
            <p>您确定采购申报商品已入库？</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
                <>
                    <p>申报表详情：</p>
                    {procureDetails && (
                        <>
                            <ShowDetails data={procureDetails} />
                        </>
                    )}
                    {recordDetails &&(
                        <>
                        <RKShowDetails checkdata={recordDetails} />
                        </>
                    )}

                    <div>
                        入库结果:
                        <select value={putinResult} onChange={(e) => setPutinResult(e.target.value)}>
                            <option value="通过">通过</option>
                            <option value="不通过">不通过</option>
                        </select>
                    </div>
                    <div>
                        入库数量（默认为申报数量）：
                        <input
                            type="number"
                            value={putinQuantities}
                            onChange={(e) =>setPutinQuantities(parseFloat(e.target.value) || 0)} // 确保输入为数字
                        />
                    </div>
                    <div>
                        备注:
                        <textarea
                            value={putinOpinion}
                            onChange={(e) => setPutinOpinion(e.target.value)}
                            placeholder="如需备注，请在此填写"
                        />
                    </div>
                </>
            <button onClick={onRequestClose}>取消</button>
            <button onClick={handleSubmit} 
                        disabled={isDisabled}
                        title={title}>
                    确认入库
                </button>
        </Modal>
    );
};
