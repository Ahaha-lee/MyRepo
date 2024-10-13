import React,{useState,useEffect} from "react";
import { RKShowDetails } from "./CaiGouRK";
import { ShowDetails } from "./CaiGouSH";
import Modal from 'react-modal';

export const CheckFBModal=({isOpen, onRequestClose, procureDetails})=>
{

    const [recordDetails, setRecordDetails] = useState();
    const [error, setError] = useState(null);
    useEffect(() => {
        if (isOpen && procureDetails && procureDetails.recordID) {
            fetchRecordDetails(procureDetails.recordID);
        }
    }, [isOpen, procureDetails]);

    const fetchRecordDetails = async (recordid) => {
        try {
            const response = await fetch(`/api/storage/operationinfo?action=check&recordID=${recordid}`);
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
            <h2>采购申报反馈</h2>
            <p>您现在正在查看采购申报审核反馈。</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>申报表详情：</p>
                    {procureDetails && (
                        <>
                            <ShowDetails data={procureDetails} />
                        </>
                    )}
            <hr></hr>
            <p>审核结果</p>
                    {recordDetails ?(
                        <>
                        <RKShowDetails checkdata={recordDetails} />
                        </>
                    ):<span>暂无验收审核数据</span>}

        </Modal>
    );

}