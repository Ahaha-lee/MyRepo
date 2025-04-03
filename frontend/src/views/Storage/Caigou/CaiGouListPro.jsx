import React, { useState, useEffect } from 'react';
import MainLayout from '../../../utils/MainLayOut/MainLayout.jsx'
import { InboundRecordsApiPro, ListApi} from '../../../api/storage';
import { getPageStatus } from './Status.jsx';
import { InfoModalPro } from './CauGouDetaillnfo.jsx'
import { Pagination } from '../../../utils/Common/SlicePage.jsx';
import { useNavigate } from 'react-router-dom';
import { CommonTable } from '../../../utils/Common/CommonTable.jsx';

export function AllProcurementDetailsPage() {
    return(
        <div>
            <MainLayout rightContent={<AllProcurementForm/>}/>
        </div>
    );
}

export function AllProcurementForm() {
    const [procurement, setProcurement] = useState([]); 
    const [recordid, setRecordid]=useState();
    const [totalNum, setTotalNum]=useState();
    const [pagecount, setPagecount]=useState('1');
    const [pagestatus, setPagestatus]=useState([]);
    const navigate = useNavigate();
    const getlist = () => {
        ListApi.cglist({
            params:{search_id:'0',page:pagecount}
        })
        .then(res => {
            console.log("list返回的数据", res);
            setProcurement(res.data);
            setTotalNum(res.total_num);
        })
        .catch(error => {
            console.error('错误的信息:', error);
        });
    };
    const totalPages = Math.ceil(totalNum / 10);
    const getinfo = async (record_id) => {
        try {
            const res = await ListApi.cglist({
                params: { search_id: record_id }
            });
            console.log('procurementdetails返回的数据', res);
            
            const procureDetails = res.data[0]; // 获取第一个数据项
            return procureDetails; 
        } catch (err) {
            console.log("错误信息",err)
        }
    };

    const getrecordinfo = async (record_id) => {
        try {
            const res = await InboundRecordsApiPro.getinfo({
                params: { search_id: record_id }
            });
            console.log('getrecordsinfo返回的数据', res);
            
            const details = res.data[0]; // 获取第一个数据项
            return details; 
        } catch (err) {
            console.log("错误信息",err)
        }
    };

    const getStatus=()=>{
        getPageStatus(pagecount)
        .then(data => {
                setPagestatus(data);
                console.log("获取状态数据成功:", data);
            })
        .catch(err => {
                console.error("获取状态数据出错:", err);
            });
    }
    
    useEffect(() => {
        getlist();
        getStatus();
    }, [pagecount]);


    return(
        <>
         <div className="mb-3">
            <label className="form-label">申请表ID:</label>
            <input 
                type="text" 
                className="form-control"
                style={{ width: '30%' }}
                value={recordid} 
                onChange={(e) => setRecordid(e.target.value)} 
            /> 
            <button className="btn btn-primary">查询</button>
        </div>
        <div className="mb-3">
            <button className="btn " type="button" onClick={() => navigate('/storage/cgsb')}>采购表申报</button>
            <button className="btn " type="button">撤销申报表</button>
            <button className="btn " type="button">修改申报表</button>
        </div>
        <hr/>
        {procurement.length>0 && (<AllProcurementList Results={procurement} fetchDetails={getinfo}  fetchRecordDetails={getrecordinfo} pagestatus={pagestatus}/>)}
        <Pagination totalPages={totalPages} onPageChange={setPagecount} />
        
        </>
    )
}

export function AllProcurementList({ Results, fetchDetails,fetchRecordDetails,pagestatus }){
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [procureDetails, setProcureDetails] = useState({});
    const [recordDetails, setRecordDetails] = useState({});
    const navigate=useNavigate();
    
    const columns = [
        {
            title: "申请表ID",
            key: "recordID"
        },
        {
            title: "标题",
            key: "title"
        },
        {
            title: "采购员工姓名",
            key: "purchaserStaffName"
        },
        {
            title: "商品名称",
            key: "cGProductName"
        },
        {
            title: "状态",
            key: "isEnd",
            render: (value, record) => matchstatus(record.recordID)
        },
    ];
    const tableActions=(record)=>(
        <>
        <button onClick={() => handleFetchDetails(record.recordID)}>查看详情</button>
        </>
    )

    const handleFetchDetails = async (recordid) => {
        try {
            const details = await fetchDetails(recordid);
            setProcureDetails(details);
            const record = await fetchRecordDetails(recordid);
            setRecordDetails(record);
            handleNavigate("info",recordid); // 在获取到详细信息后打开模态框
        } catch (error) {
            console.error("获取详细信息时出错:", error);
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

    const matchstatus = (record_id) => {
        for (let item of pagestatus) {
            if (item.recordid == record_id) {
                return item.status;
            }
        }
        return "未知状态"
    }

    const handleUpdate=async(record_id)=>{
          const updateData = await fetchDetails(record_id);
          navigate('/storage/cg_declaration/update', { state: { procurement: updateData} });
    }
    const closeModal = () => {
        setModalType(null);
        setIsOpen(false);
    };
    return (
        <div>
            <CommonTable
                columns={columns}
                data={Results}
                checkable={true}
                // onCheckChange={handleCheckboxChange}
                indexColumn={true}
                actions={tableActions}
                idField={"recordID"}
                />

            {modalType === "info" && (
                <InfoModalPro 
                    isOpen={isOpen} 
                    onRequestClose={closeModal} 
                    procureDetails={procureDetails} 
                    records={recordDetails}
                />
            )}
        </div>
    );
}

