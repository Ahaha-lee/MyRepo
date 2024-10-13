import React, { useState, useEffect } from 'react';
import { CheckModal } from './CaiGouSH';
import { PutinModal } from './CaiGouRK';
import { ExamineModal } from './CaiGouYS';
import { CGCheckKEY, CGExamineKEY, CGPutinKEY } from '../../LocalStorage/Storagelist';
import { getLocalStorage,setLocalStorage } from '../../utils/storageways';

export const CGList = () => {
    const [error, setError] = useState(null);
    const [content, setContent] = useState({ titles: [], record_ids: [] });
    const [modalType, setModalType] = useState(null);
    const [procureDetails, setProcureDetails] = useState(null);
    const [applyQuantities, setApplyQuantities] = useState();
    const [action, setAction] = useState();
    const [recordID, setRecordID] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [checkResults, setCheckResults] = useState([]);
    const [putinResults, setPutinResults] = useState([]);
    const [examineResults, setExamineResults] = useState([]);

    
    // 列表简略信息
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/storage/listdata?tablename=procurement`);
                if (!response.ok) {
                    throw new Error('获取记录失败，状态码: ' + response.status);
                }
                const data = await response.json();
                if (!data || data.titles.length === 0 || data.record_ids.length === 0) {
                    throw new Error('记录为空');
                }
                setContent(data);
             

                const storedCheckResults = getLocalStorage(CGCheckKEY, true) || Array(data.titles.length).fill('');
                const storedPutinResults = getLocalStorage(CGPutinKEY, true) || Array(data.titles.length).fill('');
                const  storedExamineResults = getLocalStorage(CGExamineKEY,true) || Array(data.titles.length).fill('');
                setCheckResults(storedCheckResults);
                setPutinResults(storedPutinResults);
                setExamineResults(storedExamineResults)
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    // 申报表信息
    const fetchprocurementDetails = async (recordid) => {
        try {
            const response = await fetch(`/api/gettableinfo?recordid=${recordid}&&tablename=procurement`);
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            const data = await response.json();
            setProcureDetails(data);
            setApplyQuantities(data.cGQuantity);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleNavigate = (recordid, type) => {
        setAction(type);
        setRecordID(recordid)
        fetchprocurementDetails(recordid);
        setModalType(type);
        setIsOpen(true);
    };

    const closeModal = () => {
        setModalType(null);
        setIsOpen(false);
    };

    const handleOperationSubmit = async (reqData, Result) => {
        try {
            const response = await fetch(`/api/storage/cgoperation?action=${action}&&recordID=${recordID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqData),
            });
            console.log("list",JSON.stringify(reqData))
            const index = content.record_ids.indexOf(recordID); // 获取当前记录的索引
            if (action === "check") {
            
                setCheckResults(prev => {
                    const newResults = [...prev];
                    newResults[index] = Result; // 更新审核结果
                    setLocalStorage(CGCheckKEY, newResults, true);
                    return newResults;
                });
            } else if (action === "putin") {
            
                setPutinResults(prev => {
                    const newResults = [...prev];
                    newResults[index] = Result; // 更新入库结果
                    setLocalStorage(CGPutinKEY, newResults, true);
                    return newResults;
                });
            } else if (action === "examine") {
               
                setExamineResults(prev => {
                    const newResults = [...prev];
                    newResults[index] = Result; // 更新验收结果
                    setLocalStorage(CGExamineKEY, newResults, true);
                    return newResults;
                });
            }

            if (!response.ok) {
                throw new Error('提交审核失败');
            }
            closeModal();
        } catch (error) {
        console.error('数据库操作失败:', error);
    }
    };

    if (error) {
        return <p style={{ color: 'red' }}>错误: {error}</p>;
    }
    console.log(checkResults)
    console.log(putinResults)
    console.log(examineResults)
    console.log(recordID)
    return (
        <div>
            <h2>采购申报列表</h2>
            <ul>
                {content.titles.map((title, index) => (
                    <li key={index}>
                        <strong>标题:</strong> {title}, <strong>记录ID:</strong> {content.record_ids[index]} &nbsp;&nbsp;
                        <button 
                            onClick={() => handleNavigate(content.record_ids[index], 'check')}
                            
                        >
                            审核
                        </button>&nbsp;

                        {checkResults[index] === '通过' && <span>已通过</span>}
                        {checkResults[index] === '不通过' && <span>未通过</span>}&nbsp;&nbsp;

                        <button 
                            onClick={() => handleNavigate(content.record_ids[index], 'putin')}
                          
                        >
                            入库
                        </button>&nbsp; 
                        {putinResults[index] === '通过' && <span>已通过</span>}
                        {putinResults[index] === '不通过' && <span>未通过</span>}&nbsp;&nbsp;
                        <button 
                            onClick={() => handleNavigate(content.record_ids[index], 'examine')}
                        >
                            验收
                        </button>&nbsp; 
                        {examineResults[index] === '通过' && <span>已通过</span>}
                        {examineResults[index] === '不通过' && <span>未通过</span>}&nbsp;&nbsp;
                    </li>
                ))}
            </ul>

            {/* 审核模态框 */}
            {modalType === 'check' && (
                <CheckModal 
                    isOpen={isOpen} 
                    onRequestClose={closeModal} 
                    procureDetails={procureDetails} 
                    state={checkResults[content.record_ids.indexOf(recordID)]}
                    onSubmit={handleOperationSubmit} 
                />
            )}

            {/* 入库模态框 */}
            {modalType === 'putin' && (
                <PutinModal 
                    isOpen={isOpen} 
                    onRequestClose={closeModal} 
                    procureDetails={procureDetails}
                    state={putinResults[content.record_ids.indexOf(recordID)]}
                    laststate={checkResults[content.record_ids.indexOf(recordID)]}
                    onSubmit={handleOperationSubmit}
                />
            )}

            {/* 验收模态框 */}
            {modalType === 'examine' && (
                <ExamineModal 
                    isOpen={isOpen} 
                    onRequestClose={closeModal} 
                    procureDetails={procureDetails}
                    state={examineResults[content.record_ids.indexOf(recordID)]}
                    laststate={putinResults[content.record_ids.indexOf(recordID)]}
                    firststate ={checkResults[content.record_ids.indexOf(recordID)]}
                    onSubmit={handleOperationSubmit} 
                />
            )}
        </div>
    );
}
