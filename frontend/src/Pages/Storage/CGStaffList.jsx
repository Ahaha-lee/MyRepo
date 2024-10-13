import React, { useState, useEffect } from 'react';
import { CGCheckKEY, CGExamineKEY, CGPutinKEY } from '../../LocalStorage/Storagelist';
import { getLocalStorage,setLocalStorage } from '../../utils/storageways';
import { CheckFBModal } from './CGSHfeedback';
import { PutinFBModal } from './CGRKfeedback';
import { ExamineFBModal } from './CGYSfeedback';


export const CGListForStaff = () => {
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



    if (error) {
        return <p style={{ color: 'red' }}>错误: {error}</p>;
    }


    console.log(checkResults)
    console.log(putinResults)
    console.log(examineResults)
    return (
        <div>
            <h2>采购申报反馈列表</h2>
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
                <CheckFBModal 
                    isOpen={isOpen} 
                    onRequestClose={closeModal} 
                    procureDetails={procureDetails} 
                    state={checkResults[content.record_ids.indexOf(recordID)]}
                />
            )}

            {/* 入库模态框 */}
            {modalType === 'putin' && (
                <PutinFBModal 
                    isOpen={isOpen} 
                    onRequestClose={closeModal} 
                    procureDetails={procureDetails}
                    state={putinResults[content.record_ids.indexOf(recordID)]}
                    laststate={checkResults[content.record_ids.indexOf(recordID)]}

                />
            )}

            {/* 验收模态框 */}
            {modalType === 'examine' && (
                <ExamineFBModal 
                    isOpen={isOpen} 
                    onRequestClose={closeModal} 
                    procureDetails={procureDetails}
                    state={examineResults[content.record_ids.indexOf(recordID)]}
                    laststate={putinResults[content.record_ids.indexOf(recordID)]}
                    firststate ={checkResults[content.record_ids.indexOf(recordID)]}

                />
            )}
        </div>
    );
}
