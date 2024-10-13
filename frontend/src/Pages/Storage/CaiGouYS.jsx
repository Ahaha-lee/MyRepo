import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import useSession from '../../useSession';
import { ShowDetails } from './CaiGouSH';

// 显示审核结果的组件
export function YSShowDetails({ putindata }) {
    return (
        <div>
            <strong>入库管理员ID: {putindata.storehouseStaffID}</strong><br/>        
            <strong>入库结果: {putindata.putINResult}</strong><br/>
            <strong>入库数量: {putindata.putInQuantities}</strong><br/>
            <strong>入库意见: {putindata.putinOpinion}</strong><br/>
            <strong>入库时间: {putindata.putInDate}</strong>
        </div>
    );
}

export const ExamineModal = ({ isOpen, onRequestClose, procureDetails, onSubmit, state, laststate, firststate }) => {
    const [examineQuantities, setExamineQuantities] = useState(0); 
    const [recordDetails, setRecordDetails] = useState();
    const [error, setError] = useState(null);
    const [examineResult, setExamineResult] = useState("通过");
    const [examineOpinion, setExamineOpinion] = useState("");

    const { getSession } = useSession();
    const handler = getSession();

    useEffect(() => {
        if (isOpen && procureDetails && procureDetails.recordID) {
            fetchRecordDetails(procureDetails.recordID);
        }
    }, [isOpen, procureDetails]);

    const fetchRecordDetails = async (recordid) => {
        try {
            const response = await fetch(`/api/storage/operationinfo?action=putin&recordID=${recordid}`);
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            const data = await response.json();
            setRecordDetails(data);
            setExamineQuantities(data.putInQuantities);
        } catch (err) {
            setError(err.message);
        } 
    };
    
    const handleSubmit = () => {
        const examineData = {
            ExamineStaffID: handler.EmployeeID,
            ExamineResult: examineResult,
            ExamineQuantities: examineQuantities,
            ExamineOpinion: examineOpinion,
            ExamineDate: "2024-01-01 00:00:00"
        };
        console.log("examindata",examineData)
        
        onSubmit(examineData, examineResult);
    };

    // 计算按钮是否禁用的逻辑
    const isDisabled = state || 
                       laststate === "不通过" || 
                       laststate === "" || 
                       laststate === null || 
                       laststate===undefined||
                       firststate === "不通过" || 
                       firststate === ""||
                       firststate===null||
                       firststate===undefined;

    // 计算按钮标题的逻辑
    const title = state ? "验收已完成，不可重复审核。" :
                  firststate === ""||null||undefined ? "还未审核，不可验收" :
                  laststate === "不通过" ? "入库未通过，不可进行验收操作" :
                  laststate === ""||null||undefined ? "还未入库，不可验收" :
                  firststate === "不通过" ? "验收未通过，不可进行验收操作" :
                  "";

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <h2>验收确认</h2>
            <p>您确定采购申报商品已验收？</p>
            <p>申报表详情：</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          
            <>
                {procureDetails && <ShowDetails data={procureDetails} />}
                {recordDetails && <YSShowDetails putindata={recordDetails} />}
            </>
         
            <div>
                验收结果:
                <select value={examineResult} onChange={(e) => setExamineResult(e.target.value)}>
                    <option value="通过">通过</option>
                    <option value="不通过">不通过</option>

                </select>
            </div>
            <div>
                验收数量（默认为入库数量）：
                <input
                    type="number"
                    value={examineQuantities}
                    onChange={(e) => setExamineQuantities(parseFloat(e.target.value))} // 确保输入为数字
                />
            </div>
            <div>
                备注:
                <textarea
                    value={examineOpinion}
                    onChange={(e) => setExamineOpinion(e.target.value)}
                    placeholder="如需备注，请在此填写"
                />
            </div>
            <button onClick={onRequestClose}>取消</button>
            <button onClick={handleSubmit} 
                        disabled={isDisabled}
                        title={title}>
                    确认验收
                </button>
        </Modal>
    );
};
