import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../../../css/storage.css';
import { ProcurementInfo } from '../dashtable';
import { getLocalStorage } from '../../../components/localstorage';
import { StautesOperation } from './Status';

export const CheckModal = ({ isOpen, onRequestClose, procureDetails, onSubmit}) => {
    const [CheckResult, setCheckResult] = useState('通过');
    const [CheckComment, setCheckComment] = useState('');
    const handler = getLocalStorage('session',true).name
    const [time,setTime]=useState(new Date())
    const record_id = procureDetails.recordID

    
    const handleSubmit = () => {       
        const checkData =( {
            CheckStaffID:10, 
            CheckStaffName :handler,
            CheckResult:CheckResult,
            CheckOpinion:CheckComment,
            CheckDate:time,
        });  
        const action="sh"
        onSubmit(checkData,action,record_id);        
    };


    return (
       <>
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} 
        style={{
            content: {
                width: '80%', // 设置模态框的宽度
                maxWidth: '80%', // 设置模态框的最大宽度
                height: 'auto', // 设置模态框的高度为自动
                margin: 'auto', // 使模态框居中
                padding: '2px', // 内边距
            },
            overlay: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)', // 设置背景遮罩的颜色
            }
        }}>
         <div className="container mt-4">
            <h2 className='text-center'>审核确认</h2>
            {procureDetails && <ProcurementInfo Results={procureDetails} />}
            
            <div className="form-group">
                <label htmlFor="checkResult">审核结果:</label>
                <select 
                    id="checkResult" 
                    className="form-control" 
                    value={CheckResult} 
                    onChange={(e) => setCheckResult(e.target.value)}
                >
                    <option value="通过">通过</option>
                    <option value="不通过">不通过</option>
                </select>
            </div>
            
            <div className="form-group">
                <label htmlFor="checkComment">审核意见:</label>
                <textarea 
                    id="checkComment" 
                    className="form-control" 
                    value={CheckComment} 
                    onChange={(e) => setCheckComment(e.target.value)} 
                    placeholder="请输入审核意见"
                />
            </div>

            <div className="form-group">
                <label htmlFor="checkDate">审核时间:</label>
                <input
                    type="text"
                    id="checkDate"
                    className="form-control"
                    value={time.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}
                    onChange={(e) => setTime(e.target.value)}
                    readOnly
                />
            </div>
            <div className="text-center">
                <br/>
                <button className="btn btn-primary mx-4" onClick={onRequestClose}>取消</button>
                <button className="btn btn-primary mx-4" 
                        onClick={handleSubmit}
                        // disabled={} 
                        title='不可重复审核'>确认审核</button>
            </div>
        </div>
    </Modal>
    </>

    );
};


