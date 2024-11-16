import React, { useState, useEffect } from 'react';
import { CGCheckKEY, CGPutinKEY,OutKEY, OutCheckKEY, } from '../../utils/Storagelist'
import { getLocalStorage,setLocalStorage } from '../../utils/localstorage';
import { PutinModal } from './CaiGouRK';
import { OutModal } from './OutCK';

export const StorageListForCG = () => {
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
    const [filteredContent, setFilteredContent] = useState([]); // 新增状态来存储过滤后的内容

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
                setContent(data)
                const storedCheckResults = getLocalStorage(CGCheckKEY, true) || Array(data.titles.length).fill('');
                const storedPutinResults = getLocalStorage(CGPutinKEY, true) || Array(data.titles.length).fill('');
                setCheckResults(storedCheckResults);
                setPutinResults(storedPutinResults);

                // 过滤出只有 checkResults 为 "通过" 的记录
                const filtered = data.record_ids.filter((id, index) => storedCheckResults[index] === "通过").map((id, index) => ({
                    id,
                    title: data.titles[index],
                }));
                console.log("filtered",filtered)
                // 更新 filteredContent 状态
                setFilteredContent(filtered);
       
                // 只在有符合条件的记录时设置 content
                if (filtered.length === 0) {
                    setError('没有符合条件的记录');
                }
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
        setRecordID(recordid);
        fetchprocurementDetails(recordid);
        setModalType(type);
        setIsOpen(true);
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
             if (action === "putin") {
            
                setPutinResults(prev => {
                    const newResults = [...prev];
                    newResults[index] = Result; // 更新入库结果
                    setLocalStorage(CGPutinKEY, newResults, true);
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

    const closeModal = () => {
        setModalType(null);
        setIsOpen(false);
    };

    if (error) {
        return <p style={{ color: 'red' }}>错误: {error}</p>;
    }

console.log(putinResults[content.record_ids.indexOf(recordID)])
console.log(applyQuantities)
    return (
        <div>
            <h2>采购申报入库审核列表</h2>
            <ul>
                {filteredContent.map((item, index) => (
                    <li key={index}>
                        <strong>标题:</strong> {item.title}, <strong>记录ID:</strong> {item.id} &nbsp;&nbsp;
                        <button 
                            onClick={() => handleNavigate(item.id, 'putin')}
                        >
                            入库
                        </button>&nbsp; 
                        {putinResults[index] === '通过' && <span>已通过</span>}
                        {putinResults[index] === '不通过' && <span>未通过</span>}&nbsp;&nbsp;
                    </li>
                ))}
           
           </ul>
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
            </div>
            );
            };

export function StorageListForOut() {
    const [error, setError] = useState(null);
    const [content, setContent] = useState({ titles: [], record_ids: [] });
    const [modalType, setModalType] = useState(null);
    const [peocuremeDetails, setProcureDetails] = useState(null);
    const [applyQuantities, setApplyQuantities] = useState();
    const [action,setAction] = useState("outcheck"); // 默认操作
    const [ recordID ,setRecordID]=useState(null); // 默认记录ID
    const [checkResults, setCheckResults] = useState([]);
    const [outResults, setOutResults] = useState([]);
    const [filteredContent, setFilteredContent] = useState([]); // 新增状态来存储过滤后的内容
    
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
                setContent(data)
                const storedCheckResults = getLocalStorage(OutCheckKEY, true) || Array(data.titles.length).fill('');
                const storedOutResults = getLocalStorage(OutKEY, true) || Array(data.titles.length).fill('');
                setCheckResults(storedCheckResults);
                setOutResults(storedOutResults);

                // 过滤出只有 checkResults 为 "通过" 的记录
                const filtered = data.record_ids.filter((id, index) => storedCheckResults[index] === "通过").map((id, index) => ({
                    id,
                    title: data.titles[index],
                }));
                console.log("filtered",filtered)
                // 更新 filteredContent 状态
                setFilteredContent(filtered);
       
                // 只在有符合条件的记录时设置 content
                if (filtered.length === 0) {
                    setError('没有符合条件的记录');
                }
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
    const handleOperationSubmit = async (reqData,Result) => {
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

           if (action === "out") {
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

    const closeModal = () => {
        setModalType(null);
    };

    if (error) {
        return <p style={{ color: 'red' }}>错误: {error}</p>;
    }

    return (
        <>
            <h2>出库申报列表：</h2>
            <ul>
                {filteredContent.map((item, index) => (
                    <li key={index}>
                        <strong>标题:</strong> {item.title}, <strong>记录ID:</strong> {item.id} &nbsp;&nbsp;
                        <button 
                            onClick={() => handleNavigate(item.id, 'out')}
                        >
                            出库
                        </button>&nbsp; 
                        {outResults[index] === '通过' && <span>已通过</span>}
                        {outResults[index] === '不通过' && <span>未通过</span>}&nbsp;&nbsp;
                    </li>
                ))}
           
           </ul>

             {modalType === 'out' && (
                 <OutModal 
                        isOpen={true} 
                        onRequestClose={closeModal} 
                        ckQuantities={applyQuantities}
                        procureDetails={peocuremeDetails}
                        state={outResults[content.record_ids.indexOf(recordID)]}
                        laststate={checkResults[content.record_ids.indexOf(recordID)]} 
                        onSubmit={handleOperationSubmit} 
             />
            )}
        </>
    );
};