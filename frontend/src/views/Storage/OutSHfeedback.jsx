import React,{useState,useEffect} from "react";
import { CkShowDetails } from "./OutCK";
import { ShowDetails } from "./OutSH";
import Modal from 'react-modal';

export const OutCheckFBModal=({isOpen, onRequestClose, procureDetails})=>
{
    console.log(procureDetails)
    const [recordDetails, setRecordDetails] = useState();
    const [error, setError] = useState(null);
    useEffect(() => {
        if (isOpen && procureDetails && procureDetails.recordID) {
            fetchRecordDetails(procureDetails.recordID);
        }
    }, [isOpen, procureDetails]);

    const fetchRecordDetails = async (recordid) => {
        try {
            const response = await fetch(`/api/storage/operationinfo?action=outcheck&recordID=${recordid}`);
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            const data = await response.json();
            setRecordDetails(data);
        } catch (err) {
            setError(err.message);
        }
    };
    return(
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <h2>采购出库反馈</h2>
            <p>您现在正在查看出库申报审核反馈。</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>申报表详情：</p>
                    {procureDetails && (
                        <>
                            <ShowDetails product={procureDetails} />
                        </>
                    )}
            <hr></hr>
            <p>审核结果</p>
                    {recordDetails ?(
                        <>
                        <CkShowDetails checkdata={recordDetails} />
                        </>
                    ):<span>暂无审核数据</span>}

        </Modal>
    );

}