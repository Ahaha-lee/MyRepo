import { CKOperationApi, ListApi, OutRecordsApi } from "../../../api/storage";
import MainLayout from "../../../utils/MainLayOut/MainLayout";
import React from "react";
import { useEffect, useState } from "react";
import { InfoModal } from "./OutDetailInfo";
import { CheckModal } from "./OutSH"
import { OutModal } from "./OutCK";
import { StautesCKOperation } from "./Status";
export function OutOpertionPage(){
    return(
        <MainLayout rightContent={<OutOpertionForm/>} />
    )
}
export const OutOpertionForm = () => {
    const [message, setMessage] = useState('');
    const [delcatationbrief,setDeclarationbrief]=useState([]);

    
    // 列表简略信息
    useEffect(() => {
        const fetchData = async () => {
            try {
                OutRecordsApi.getinfo().then((res) => {
                console.log('list返回的数据', res)
                setDeclarationbrief(res.data);
                })
            } catch (err) {
                console.log("错误信息",err)
            }
        };


        fetchData();
    }, []);


    // 申报表信息 查看详情
    const fetchoutdeclaDetails = async (recordid) => {
        try {
            const res = await ListApi.cklist({
                params: { search_id: recordid }
            });
            console.log('declarationdetails返回的数据', res);
            
            const DeclarationDetails = res.data[0]; // 获取第一个数据项
            return DeclarationDetails; 
        } catch (err) {
            setMessage(err.message); // 处理错误
        }
    };
    
    return (
        <div>
            <h2>未完成的出库申报表</h2>
            {delcatationbrief.length > 0 && <OutDeclarationList Results={delcatationbrief} fetchDetails={fetchoutdeclaDetails}/>}
            
        </div>
    );
}

export  const OutDeclarationList=({ Results, fetchDetails })=>{
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [DeclarationDetails, setDeclarationDetails] = useState({});


    const handleFetchDetails = async (recordid) => {
        try {
            const details = await fetchDetails(recordid);
            setDeclarationDetails(details);
            console.log('获取的详细信息',DeclarationDetails);
            handleNavigate("info",recordid); // 在获取到详细信息后打开模态框
        } catch (error) {
            console.error("获取详细信息时出错:", error);
        }
    };
    const handleSubmit = (reqData,action,record_id) => {
        console.log("提交数据",reqData)
        console.log("action",action)
        console.log("record_id",record_id)
        try{
          CKOperationApi.update({
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
        setDeclarationDetails(details);
        if (!isOpen) {
            setIsOpen(true);
        }
        setModalType(action);
    };

    const closeModal = () => {
        setModalType(null);
        setIsOpen(false);
    };


    return(
         <div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">申请表ID</th>
                        <th scope="col">标题</th>
                        <th scope="col">理货员姓名</th>
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
                            <td>{result.applyStaffName}</td>
                            <td>{result.outProductName}</td>
                            {/* <td><StautesCKOperation recordid={result.recordID}/></td> */}
                            <td>
                                <button onClick={() => handleFetchDetails(result.recordID)}>查看详情</button>
                                <button onClick={() => handleNavigate("check",result.recordID)}>审核</button>
                                <button onClick={() => handleNavigate("out",result.recordID)}>出库</button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {modalType === "info" && (
                <InfoModal 
                    isOpen={isOpen} 
                    onRequestClose={closeModal} 
                    outdeclarationDetails={DeclarationDetails} 
                />
            )}
            {modalType === "check" && (
                <CheckModal 
                    isOpen={isOpen} 
                    onRequestClose={closeModal} 
                    outdeclarationDetails={DeclarationDetails} 
                    onSubmit={handleSubmit} 
                />
            )}
            {modalType === "out" && (
                <OutModal 
                    isOpen={isOpen} 
                    onRequestClose={closeModal} 
                    outdeclarationDetails={DeclarationDetails} 
                    onSubmit={handleSubmit} 
                />
            )}
        </div>
    )

}