import React, { useState,useEffect} from 'react';
import Modal from 'react-modal';
import useSession from '../../useSession';
import { ShowDetails } from './OutSH';

// 出库功能的出库 就是理货员提交出库申报 审核通过申报表，进行出库 这个功能页面 理货员账号下也得来一张 出库时理货员的操作
export function CkShowDetails({checkdata}){
    console.log(checkdata)
    return(
        <div>
            <strong>审核人员id：{checkdata.oCheckStaffID}</strong><br/>
            <strong>审核结果：{checkdata.oCheckResult}</strong><br/>
            <strong>审核意见：{checkdata.oCheckOpinion}</strong><br/>
            <strong>审核时间：{checkdata.checkDate}</strong> <br/>
        </div>
    );
}


export const OutModal = ({ isOpen, onRequestClose, procureDetails,onSubmit,state,laststate }) => {
    const [OutResult, setOutResult] = useState('通过');
    const [OutComment, setOutComment] = useState('');
    const [recordDetails, setRecordDetails] = useState();
    const [outQuantities, setOutQuantities] = useState(0)
    const [error, setError] = useState(null);
    const {getSession} = useSession();
    const handler = getSession();

    const params = new URLSearchParams({
        tablename:"inventorydata",
        action:"out",
        keyword:"INVBarcode",
    });
    useEffect(() => {
        if (isOpen && procureDetails && procureDetails.recordID) {
            fetchRecordDetails(procureDetails.recordID);
            ChangeQuantities(procureDetails.outProductBarcode)
        }
    }, [isOpen, procureDetails]);
    useEffect(() => {
        // 在 procureDetails 更新时设置 putinQuantities
        if (procureDetails && procureDetails.outQuantity) {
            setOutQuantities(parseFloat(procureDetails.outQuantity) || 0);
        }
    }, [procureDetails]);

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
    console.log(recordDetails)
    const ChangeQuantities = async (id)=> {
        console.log("id",id)
        try {
            const response = await fetch(`/api/storage/inventorychange?${params}&&id=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(outQuantities),
            });
    
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }

        } catch (error) {
            console.error("更新失败:", error);
            alert(error.message); 
            throw error; 
        }
    };
    
    const handleSubmit = async () => {
        const outData = {
            OStoreHouseStaffID   :handler.EmployeeID,
            OStoreHouseStaffName :handler.FirstName+handler.LastName,
            OStoreHouseResult   :OutResult,
            OStoreHouseOpinion   :OutComment,
        };

    

        if (OutResult === "通过") {
            try {
                console.log(procureDetails.outProductBarcode)
                 ChangeQuantities(procureDetails.outProductBarcode);
            } catch (error) {
                return;
            }
        }
        onSubmit(outData,OutResult);
    
    };
    
    
        // 计算按钮是否禁用的逻辑
      const isDisabled = state || 
      laststate === "不通过" || 
      laststate === "" || 
      laststate === null || 
      laststate===undefined;
    

    // 计算按钮标题的逻辑
    const title = state ? "验收已完成，不可重复审核。" :
    laststate === "不通过" ? "审核未通过，不可进行出库操作" :
    laststate === ""||null||undefined ? "还未审核，不可出库" :  
    "";

  return (
      <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
          <h2>出库确认</h2>
          <p>您确定要出库申报商品出库吗？</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <p>申报表详情：</p>
          {procureDetails && <ShowDetails product={procureDetails} />}
          {recordDetails &&(
                        <>
                        <CkShowDetails checkdata={recordDetails} />
                        </>
                    )}
          <div>
              审核结果:
              <select value={OutResult} onChange={(e) => setOutResult(e.target.value)}>
                  <option value="通过">通过</option>
                  <option value="不通过">不通过</option>
              </select>
          </div>
          <div>
             出库数量(默认为申报数量)：
             <input
                            type="number"
                            value={outQuantities}
                            onChange={(e) =>setOutQuantities(parseFloat(e.target.value) || 0)} // 确保输入为数字
                        />
          </div>
          <div>
              审核意见:
              <textarea 
                  value={OutComment} 
                  onChange={(e) => setOutComment(e.target.value)} 
                  placeholder="请输入审核意见"

              />
          </div>
          <button onClick={onRequestClose}>取消</button>
          <button onClick={handleSubmit} 
                        disabled={isDisabled}
                        title={title}>
                    确认出库
                </button>
      </Modal>
  );
};