import React, { useState, useEffect } from 'react';

import { getLocalStorage,setLocalStorage } from '../../utils/storageways';
import {OutKEY,OutCheckKEY } from '../../LocalStorage/Storagelist';
import { OutCheckFBModal } from './OutSHfeedback';
import { OutFBModal } from './OutCkfeedback';
// 顶级boss下的出库申报列表
export function OutListForStaff() {
    const [error, setError] = useState(null);
    const [content, setContent] = useState({ titles: [], record_ids: [] });
    const [modalType, setModalType] = useState(null);
    const [peocuremeDetails, setProcureDetails] = useState(null);
    const [applyQuantities, setApplyQuantities] = useState();
    const [action,setAction] = useState("outcheck"); // 默认操作
    const [ recordID ,setRecordID]=useState(null); // 默认记录ID
    const [checkResults, setCheckResults] = useState([]);
    const [outResults, setOutResults] = useState([]);
    
    // 列表简略信息
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/storage/listdata?tablename=outdeclaration`);
                if (!response.ok) {
                    throw new Error('获取记录失败，状态码: ' + response.status);
                }
                const data = await response.json();
                if (!data || data.titles.length === 0 || data.record_ids.length === 0) {
                    throw new Error('记录为空');
                }
                setContent(data);

                const storedCheckResults = getLocalStorage(OutCheckKEY, true) || Array(data.titles.length).fill('');
                const storedOutResults = getLocalStorage(OutKEY, true) || Array(data.titles.length).fill('');
                setCheckResults(storedCheckResults);
                setOutResults(storedOutResults);
               
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    // 申报表信息
    const fetchprocurementDetails = async (recordid) => {
        try {
            const response = await fetch(`/api/gettableinfo?recordid=${recordid}&&tablename=outdeclaration`);
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            const data = await response.json();
            setProcureDetails(data);
            setApplyQuantities(data.outQuantity);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleNavigate = (recordid, type) => {
        setAction(type);
        setRecordID(recordid)
        fetchprocurementDetails(recordid);
        setModalType(type);
    };

    const closeModal = () => {
        setModalType(null);
    };

    if (error) {
        return <p style={{ color: 'red' }}>错误: {error}</p>;
    }
console.log(peocuremeDetails)
    return (
        <>
            <h2>出库申报列表：</h2>
            <ul>
                {content.titles.map((title, index) => (
                    <li key={index}>
                        <strong>标题:</strong> {title}, <strong>记录ID:</strong> {content.record_ids[index]} &nbsp;&nbsp;
                        <button 
                            onClick={() => handleNavigate(content.record_ids[index], 'outcheck')}
                        >
                            审核
                            </button>&nbsp; 
                        {checkResults[index] === '通过' && <span>已通过</span>}
                        {checkResults[index] === '不通过' && <span>未通过</span>}&nbsp;&nbsp;

                        <button 
                            onClick={() => handleNavigate(content.record_ids[index], 'out')}
                        >
                            出库
                            </button>&nbsp; 
                        {outResults[index] === '通过' && <span>已通过</span>}
                        {outResults[index] === '不通过' && <span>未通过</span>}&nbsp;&nbsp;

                    </li>
                ))}
            </ul>
            {modalType === 'outcheck' && (
                <OutCheckFBModal
                    isOpen={true} 
                    onRequestClose={closeModal} 
                    procureDetails={peocuremeDetails} 
                    state={checkResults[content.record_ids.indexOf(recordID)]}
                />
            )}
             {modalType === 'out' && (
                <OutFBModal 
                    isOpen={true} 
                    onRequestClose={closeModal} 
                    procureDetails={peocuremeDetails}
                    state={outResults[content.record_ids.indexOf(recordID)]}
                    laststate={checkResults[content.record_ids.indexOf(recordID)]} 
                />
            )}
        </>
    );
}
