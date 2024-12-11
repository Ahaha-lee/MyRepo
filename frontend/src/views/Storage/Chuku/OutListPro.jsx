import React, { useState, useEffect } from 'react';
import MainLayout from '../../../utils/MainLayOut/MainLayout.jsx'
import { ListApi, OutboundRecordsApiPro} from '../../../api/storage';
import { getPageStatus } from './Status.jsx';
import { InfoModalPro } from './OutDetailInfo';
import { Pagination } from '../../../utils/SlicePage';
import { useNavigate } from 'react-router-dom';
export function AllOutDecalarationDetailsPage() {
    return(
        <div>

            <MainLayout rightContent={< AllODeclarationForm/>}/>
        </div>
    );
}

export function AllODeclarationForm() {
    const [outdeclaration, setOutDeclaration] = useState([]); 
    const [recordid, setRecordid]=useState();
    const [totalNum, setTotalNum]=useState();
    const [pagecount, setPagecount]=useState('1');
    const [pagestatus, setPagestatus]=useState([]);
    const navigate = useNavigate();
    const getlist = () => {
        ListApi.cklist({
            params:{search_id:'0',page:pagecount}
            
        })
        .then(res => {
            setOutDeclaration(res.data)
            setTotalNum(res.total_num);
        })
        .catch(error => {
            console.error('错误的信息:', error);
        });
    };
    const totalPages = Math.ceil(totalNum / 10);
    const getinfo = async (record_id) => {
        try {
            const res = await ListApi.cklist({
                params: { search_id: record_id }
            });
            console.log('outdelarationdetails返回的数据', res);
            
            const details = res.data[0]; // 获取第一个数据项
            return details; 
        } catch (err) {
            console.log("错误信息",err)
        }
    };

    const getrecordinfo = async (record_id) => {
        try {
            const res = await OutboundRecordsApiPro.getinfo({
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
            <button className="btn " type="button" onClick={() => navigate('/storage/cksb')}>出库表申报</button>
            <button className="btn " type="button">撤销申报表</button>
        </div>
        <hr/>
        {outdeclaration.length>0&&(<AllODeclarationList Results={outdeclaration} fetchDetails={getinfo} fetchRecords={getrecordinfo} pagestatus={pagestatus}/>)}
        <Pagination totalPages={totalPages} onPageChange={setPagecount} />

        </>
    )
}



export function AllODeclarationList({ Results, fetchDetails,fetchRecords,pagestatus}){
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [outdetails, setOutdetails] = useState({});
    const [recordDetails, setRecordDetails]=useState({});
    const [selectAllChecked, setSelectAllChecked]=useState(false);
    const [checkboxStates, setCheckboxStates] = useState({ });

    useEffect(() => {
        inicheck();
      }, [Results]);
      // 初始化页面商品勾选状态 为flase
      const inicheck=()=>{
        const initialStates = Results.reduce((acc, declarations) => {
          acc[declarations.recordID] = false;
          return acc;
          }, {}); 
            setCheckboxStates(initialStates);
      }
       // 处理全选框点击事件的函数
       const handleSelectAllClick = () => {
        setSelectAllChecked(!selectAllChecked);
        const newCheckboxStates = {};
        Results.forEach((declaration) => {
          newCheckboxStates[declaration.ProductID] = !selectAllChecked;
        });
        setCheckboxStates(newCheckboxStates);
        // setPcheckstatus(newCheckboxStates);
       }
    
      //  页面小框单独点击事件函数
       const handleCheckboxChange = (id) => {
        setCheckboxStates(prevStates => ({
          ...prevStates,
          [id]: !prevStates[id]
        }));
        // setPcheckstatus(pre=>({
        //   ...pre,
        //   [id]:!pre[id]
        // }))
      };
    console.log(checkboxStates)    
    const handleFetchDetails = async (recordid) => {
        try {
            const details = await fetchDetails(recordid);
            setOutdetails(details);
            const record = await fetchRecords(recordid);
            setRecordDetails(record);
            handleNavigate("info",recordid); // 在获取到详细信息后打开模态框
        } catch (error) {
            console.error("获取详细信息时出错:", error);
        }
    };
 
    
    const handleNavigate = async(action,record_id) => {
        const details = await fetchDetails(record_id);
        setOutdetails(details);
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

    const closeModal = () => {
        setModalType(null);
        setIsOpen(false);
    };
    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th>
                        {/* 页面全选 */}
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectAllChecked}
                            onChange={handleSelectAllClick}
                        />
                        </th>
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
                            <td>
                                {/* 页面单选 */}
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={checkboxStates[result.recordID]} 
                                    onChange={() => handleCheckboxChange(result.recordID)}
                                />
                            </td>
                            <td scope="row">{index + 1}</td>
                            <td>{result.recordID}</td>
                            <td>{result.title}</td>
                            <td>{result.applyStaffName}</td>
                            <td>{result.outProductName}</td>
                            <td>{matchstatus(result.recordID)}</td>
                            <td>
                                <button onClick={() => handleFetchDetails(result.recordID)}>查看详情</button>
                            
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {modalType === "info" && (
                <InfoModalPro 
                    isOpen={isOpen} 
                    onRequestClose={closeModal} 
                    outdeclarationDetails={outdetails}
                    records={recordDetails} 
                />
            )}
        </div>
    );
}







