import React, { useState} from 'react';
import Modal from 'react-modal';
import useSession from '../../useSession';

export function ShowDetails({product}){
    console.log(product)
    return (
        <div>
        商品出库申报信息:<br />
        <strong>标题:</strong> {product.title} <br />
        <strong>记录ID:</strong>{product.recordID}<br/>
        <strong>申报人ID:</strong>{product. applyStaffID} <br />
        <strong>申报人姓名:</strong>{product.applyStaffName} <br />
        <strong>商品名称:</strong> {product.outProductName} <br />
        <strong>商品条码:</strong> {product.outProductBarcode} <br />
        <strong>出库原因：</strong>{product.outReason} <br />
        <strong>出库数量：</strong>{product.outQuantity} <br />
        <strong>数量单位：</strong>{product. outProductUnit} <br />      
        <strong>申报时间:</strong>{product.outApplyTime} <br />
        <hr />
    </div>
    );

}
// 给出库申报表进行审核 这是顶级boss干的事  接下来的数据应该放在记录表中
export const CheckModal = ({ isOpen, onRequestClose,procureDetails, onSubmit,state }) => {
    const [CheckResult, setCheckResult] = useState('通过');
    const [CheckComment, setCheckComment] = useState('');
    const {getSession} = useSession();
    const handler = getSession();

    const handleSubmit = () => {
        
        const checkData =( {
            OCheckStaffId :handler.EmployeeID,
            OCheckStaffName :handler.FirstName+handler.LastName,
            OCheckResult :CheckResult,
            OCheckOpinion :CheckComment,
            OCheckDate:"2024-01-01 00:00:00",
      });
      onSubmit(checkData,CheckResult);
  };

  return (
      <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
          <h2>审核确认</h2>
          <p>您确定要审核此出库申报吗？</p>
          <p>申报表详情：</p>
          {procureDetails && <ShowDetails product={procureDetails} />}
          <div>
              审核结果:
              <select value={CheckResult} onChange={(e) => setCheckResult(e.target.value)}>
                  <option value="通过">通过</option>
                  <option value="不通过">不通过</option>
              </select>
          </div>
          <div>
              审核意见:
              <textarea 
                  value={CheckComment} 
                  onChange={(e) => setCheckComment(e.target.value)} 
                  placeholder="请输入审核意见"
              />
          </div>
          <button onClick={onRequestClose}>取消</button>
          <button onClick={handleSubmit}
          disabled={state}
          title={state ? "审核已完成，不可重复审核。" : ""}>确认审核</button>
      </Modal>
  );
};