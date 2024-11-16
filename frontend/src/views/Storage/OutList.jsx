import React, { useState, useEffect } from 'react';
import { CheckModal } from './OutSH';
import { OutModal } from './OutCK';
import { getLocalStorage,setLocalStorage } from '../../utils/localstorage';
import { OutCheckKEY,OutKEY } from '../../utils/Storagelist';

// 顶级boss下的出库申报列表
export function OutList() {
    const [error, setError] = useState(null);
    const [content, setContent] = useState({ titles: [], record_ids: [] });
    const [modalType, setModalType] = useState(null);
    const [peocuremeDetails, setProcureDetails] = useState(null);
    const [applyQuantities, setApplyQuantities] = useState();
    const [action,setAction] = useState("outcheck"); // 默认操作
    const [ recordID ,setRecordID]=useState(null); // 默认记录ID
    const [checkResults, setCheckResults] = useState([]);
    const [outResults, setOutResults] = useState([]);
    // 获取列表数据
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
    
   // 获取记录详情
   const fetchProcurementDetails = async (recordid) => {
    try {
        const response = await fetch(`/api/gettableinfo?recordid=${recordid}&&tablename=outdeclaration`);
        if (!response.ok) {
            throw new Error('网络响应不正常');
        }
        const data = await response.json();
        setProcureDetails(data);
        console.log(peocuremeDetails)
        setApplyQuantities(data.outQuantity)
    } catch (err) {
        setError(err.message);
    }
};

    // 处理模态框的打开和关闭
    const handleNavigate = (recordid, type) => {
        setAction(type)
        setRecordID(recordid)
        fetchProcurementDetails(recordid);
        setModalType(type);

    };

    const closeModal = () => {
        setModalType(null);
    };

    const handleOperationSubmit = async (reqData,Result) => {
        console.log(reqData)
        try {
            const response = await fetch(`/api/storage/outoperation?action=${action}&&recordID=${recordID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    reqData  
                 ),
                
            });
            console.log(JSON.stringify(
                reqData  
             ))
            const index = content.record_ids.indexOf(recordID); // 获取当前记录的索引

            if (action === "outcheck") {
                setCheckResults(prev => {
                    const newResults = [...prev];
                    newResults[index] = Result; // 更新审核结果
                    setLocalStorage(OutCheckKEY, newResults, true); // 存储到本地
                    return newResults;
                });
            } else if (action === "out") {
                setOutResults(prev => {
                    const newResults = [...prev];
                    newResults[index] = Result; // 更新入库结果
                    setLocalStorage(OutKEY, newResults, true); // 存储到本地
                    return newResults;
                });
            }
            if (!response.ok) {
                throw new Error('提交审核失败');
            }

            closeModal();
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) {
        return <p style={{ color: 'red' }}>错误: {error}</p>;
    }

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
                <CheckModal 
                    isOpen={true} 
                    onRequestClose={closeModal} 
                    procureDetails={peocuremeDetails} 
                    state={checkResults[content.record_ids.indexOf(recordID)]}
                    onSubmit={handleOperationSubmit} 
                />
            )}
             {modalType === 'out' && (
                <OutModal 
                    isOpen={true} 
                    onRequestClose={closeModal} 
                    procureDetails={peocuremeDetails}
                    state={outResults[content.record_ids.indexOf(recordID)]}
                    laststate={checkResults[content.record_ids.indexOf(recordID)]} 
                    onSubmit={handleOperationSubmit} 
                />
            )}
        </>
    );
}
