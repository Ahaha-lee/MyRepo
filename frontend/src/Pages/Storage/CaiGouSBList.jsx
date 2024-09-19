import { INBOUNDRECORDKEY, PROCUREMENTKEY } from "../../Mock/inventoryMock";
import { getLocalStorage } from "../../utils/storageways";
import { useNavigate } from "react-router-dom"; 
import React from 'react';

export function CGList() {
    const navigate = useNavigate(); 
    const Inboundrecords = getLocalStorage(INBOUNDRECORDKEY, true) || []; // 采购记录表
    if (!Inboundrecords || Inboundrecords.length === 0) {
        return (
            <>
                暂无采购申报表
            </>
        );
    }

    const handleNavigate = (recordid, type) => {     

        switch (type) {
            case 'review':
                navigate(`/checkforcaigou/${recordid}`);
                break;
            case 'acceptance':
                navigate(`/acceptanceforcaigou/${recordid}`);
                break;
            case 'putin':
                navigate(`/putinforcaigou/${recordid}`);
                break;
            default:
                break;
        }
    };

    return (
        <>
            采购申报列表：
            <ul>
                {Inboundrecords.map(item => {
                    let inboundRecord = null;

                    if (Inboundrecords.length > 0) {
                        inboundRecord = Inboundrecords.find(record => record.RecordID === item.RecordID);
                    }else{
                        return null;
                    }
                    const isReview = inboundRecord.CheckResult?true:false;
                    console.log('isr',isReview)
                    const isputin = inboundRecord.PutINResult?true:false;
                    console.log('isp',isputin)
                    const isaccept = inboundRecord.ExamineResult?true:false;
                    console.log('isa',isaccept);
                    const canPutIn = inboundRecord && inboundRecord.CheckResult === 'yes'; // 入库按钮条件
                    const canAcceptance = inboundRecord && inboundRecord.PutINResult === 'yes'; // 验收按钮条件
                    

                    return (
                        <li key={item.RecordID}>
                            {`${item.Title} (ID: ${item.RecordID})`}
                            <button 
                                onClick={() => handleNavigate(item.RecordID, 'review')}
                                disabled={isReview}
                            >
                                审核
                            </button>&nbsp;
                            <button 
                                onClick={() => handleNavigate(item.RecordID, 'putin')} 
                                disabled={!canPutIn||isputin } // 如果 CheckResult 不是 'yes' 或已入库则禁用
                            >
                                入库
                            </button>&nbsp;
                            <button 
                                onClick={() => handleNavigate(item.RecordID, 'acceptance')} 
                                disabled={!canAcceptance||isaccept } // 如果 PutINResult 不是 'yes' 或已验收则禁用
                            >
                                验收
                            </button>
                            审核结果： {`${inboundRecord.CheckResult ? (inboundRecord.CheckResult === 'yes' ? '通过' : '不通过') : '还未审核'}`}&nbsp;
                            入库结果： {`${inboundRecord.PutINResult ? (inboundRecord.PutINResult === 'yes' ? '通过' : '不通过') : '还未入库'}`}&nbsp;
                            验收结果： {`${inboundRecord.ExamineResult ? (inboundRecord.ExamineResult === 'yes' ? '通过' : '不通过') : '还未验收'}`}&nbsp;
                             </li>
                    );
                })}
            </ul>
        </>
    );
}
