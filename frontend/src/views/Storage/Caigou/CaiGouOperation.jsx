import React, { useState, useEffect } from 'react';
import { CheckModal } from './CaiGouSH';
import MainLayout from '../../../utils/MainLayOut/MainLayout.jsx'
import { CGOperationApi, InboundRecordsApi,ListApi, StatusApi} from '../../../api/storage';
import { PutinModal } from './CaiGouRK';
import { ExamineModal } from './CaiGouYS';
import { StatuesOperation } from './Status.jsx';
import { InfoModal } from './CauGouDetaillnfo.jsx';


export function CaiGouOpertionPage(){
    return(
        <MainLayout rightContent={<CaiGouOpertionForm/>} />
    )
}
export const CaiGouOpertionForm = () => {
    const [message, setMessage] = useState('');
    const [procurebrief,setProcurebrief]=useState([]);

    
    // 列表简略信息
    useEffect(() => {
        const fetchData = async () => {
            try {
                InboundRecordsApi.getinfo().then((res) => {
                console.log('list返回的数据', res)
                setProcurebrief(res.data);
                });

            } catch (err) {
                console.log("错误信息",err)
            }
        };


        fetchData();
    }, []);


    // 申报表信息 查看详情
    const fetchprocurementDetails = async (recordid) => {
        try {
            const res = await ListApi.cglist({
                params: { search_id: recordid }
            });
            console.log('procurementdetails返回的数据', res);
            
            const procureDetails = res.data[0]; // 获取第一个数据项
            return procureDetails; // 返回采购详情
        } catch (err) {
            setMessage(err.message); // 处理错误
        }
    };
    
    return (
        <div>
            <h2>未完成的采购申报表</h2>
            {procurebrief.length>0 &&<ProcurementList Results={procurebrief} fetchDetails={fetchprocurementDetails}/>}

            
        </div>
    );
}

export const ProcurementList = ({ Results, fetchDetails }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [procureDetails, setProcureDetails] = useState({});
    
    const handleFetchDetails = async (recordid) => {
        try {
            const details = await fetchDetails(recordid);
            setProcureDetails(details);
            handleNavigate("info",recordid); // 在获取到详细信息后打开模态框
        } catch (error) {
            console.error("获取详细信息时出错:", error);
        }
    };
    
    const handleSubmit = (reqData,action,record_id) => {

        try{
            CGOperationApi.update({
                type:action,
                params:{update_id:record_id},
                data:reqData
            }).then((res) => {
                console.log('返回的数据', res);   
            })
        }catch (error) {
        console.error('错误信息:', error);
        }
    };

    const handleNavigate = async(action,record_id) => {
        const details = await fetchDetails(record_id);
        setProcureDetails(details);
        if (!isOpen) {
            setIsOpen(true);
        }
        setModalType(action);
    };

    const closeModal = () => {
        setModalType(null);
        setIsOpen(false);
    };
    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">申请表ID</th>
                        <th scope="col">标题</th>
                        <th scope="col">采购员工姓名</th>
                        <th scope="col">商品名称</th>
                        <th scope="col">状态</th>
                        <th scope="col">操作</th>
                    </tr>
                </thead>
                <tbody>
                    {Results.map((result, index) => (
                        <tr key={result.recordID}>
                            <th scope="row">{index + 1}</th>
                            <td>{result.recordID}</td>
                            <td>{result.title}</td>
                            <td>{result.purchaserStaffName}</td>
                            <td>{result.cGProductName}</td>
                            {/* <td>{<StatuesOperation recordid={result.recordID} action={"list"}/>}</td> */}
                            <td>
                                <button onClick={() => handleFetchDetails(result.recordID)}>查看详情</button>
                                <button onClick={() => handleNavigate("check",result.recordID)}>审核</button>
                                <button onClick={() => handleNavigate("putin",result.recordID)}>入库</button>
                                <button onClick={() => handleNavigate("examine",result.recordID)}>验收</button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {modalType === "info" && (
                <InfoModal 
                    isOpen={isOpen} 
                    onRequestClose={closeModal} 
                    procureDetails={procureDetails} 
                />
            )}
            {modalType === "check" && (
                <CheckModal 
                    isOpen={isOpen} 
                    onRequestClose={closeModal} 
                    procureDetails={procureDetails} 
                    onSubmit={handleSubmit} 
                />
            )}
            {modalType === "putin" && (
                <PutinModal 
                    isOpen={isOpen} 
                    onRequestClose={closeModal} 
                    procureDetails={procureDetails} 
                    onSubmit={handleSubmit} 
                />
            )}
            {modalType === "examine" && (
                <ExamineModal 
                    isOpen={isOpen} 
                    onRequestClose={closeModal} 
                    procureDetails={procureDetails} 
                    onSubmit={handleSubmit} 
                />
            )}
        </div>
    );
};

