import React, { useState, useEffect } from "react";
import { ShowDetails } from "./OutSH";
import Modal from 'react-modal';

export function CKFBShowDetails({ outdata }) {
    console.log(outdata);
    return (
        <div>
            <strong>出库管理员ID：{outdata.oStoreHouseStaffID}</strong><br />
            <strong>出库审核结果：{outdata.oStoreHouseResult}</strong><br />
            <strong>出库审核意见：{outdata.oStoreHouseOpinion}</strong><br />
            <strong>出库审核时间：{outdata.outDate}</strong><br />
        </div>
    );
}

export const OutFBModal = ({ isOpen, onRequestClose, procureDetails }) => {
    const [recordDetails, setRecordDetails] = useState();
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && procureDetails && procureDetails.recordID) {
            fetchRecordDetails(procureDetails.recordID);
        }
    }, [isOpen, procureDetails]);

    const fetchRecordDetails = async (recordid) => {
        try {
            const response = await fetch(`/api/storage/operationinfo?action=out&recordID=${recordid}`);
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            const data = await response.json();
            setRecordDetails(data);
        } catch (err) {
            setError(err.message);
        }
    };

    console.log(recordDetails);

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <h2>采购出库反馈</h2>
            <p>您现在正在查看出库申报出库审核反馈。</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>申报表详情：</p>
            {procureDetails && (
                <>
                    <ShowDetails product={procureDetails} />
                </>
            )}
            <hr />
            <p>审核结果</p>
            {recordDetails ? (
                <>
                    <CKFBShowDetails outdata={recordDetails} />
                </>
            ) : (
                <span>暂无出库审核数据</span>
            )}
        </Modal>
    );
};
