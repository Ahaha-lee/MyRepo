import React, { useState } from 'react';
import Modal from 'react-modal';
import useSession from '../../useSession';

export function ShowDetails({data}){
  return (
    <>
        <div>
            <strong>标题:</strong> {data.title} <br />
            <strong>采购记录ID:</strong> {data.recordID} <br />
            <strong>采购员工ID:</strong> {data.purchaserStaffID} <br />
            <strong>采购员工姓名:</strong> {data.purchaserStaffName} <br />
            <strong>商品条码:</strong> {data.cGProductBarcode} <br />
            <strong>商品类别:</strong> {data.cGProCategory} <br />
            <strong>商品名称:</strong> {data.cGProductName} <br />
            <strong>成本价:</strong> {data.cGCostPrice} <br />
            <strong>数量:</strong> {data.cGQuantity} <br />
            <strong>单位:</strong> {data.cGProductUnit} <br />
            <strong>生产公司:</strong> {data.productionCompany} <br />
            <strong>生产地点:</strong> {data.productAddress} <br />
            <strong>产品描述:</strong> {data.productDescription} <br />
            <strong>选择该商品的理由:</strong> {data.selectReason} <br />
            <strong>供应商名称:</strong> {data.supplierName} <br />
            <strong>供应商ID:</strong> {data.supplierID} <br />
            <strong>供应商地址:</strong> {data.supplierAddress} <br />
            <strong>供应商直接联系人:</strong> {data.supplierContactName} <br />
            <strong>供应商直接联系人电话号码:</strong> {data.supplierContactPhone} <br />
            <strong>供应商备用联系号码:</strong> {data.supplierContactStandby} <br />
            <strong>供应商公司邮件:</strong> {data.supplierEmail} <br />
            <strong>申报表提交时间:</strong> {data.applyDate } <br />
            <hr/>
        </div>
    </>
    );
}
export const CheckModal = ({ isOpen, onRequestClose, procureDetails, onSubmit,state }) => {
    const [CheckResult, setCheckResult] = useState('通过');
    const [CheckComment, setCheckComment] = useState('');
    const {getSession} = useSession();
    const handler = getSession();
    const handleSubmit = () => {       
        const checkData =( {
            CheckStaffID :handler.EmployeeID, 
            CheckStaffName :handler.FirstName+handler.LastName,
            CheckResult:CheckResult,
            CheckOpinion:CheckComment,
        });  
        onSubmit(checkData,CheckResult);        
    };
    console.log(state)
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <h2>审核确认</h2>
            <p>您确定要审核此采购申报吗？</p>
            <p>申报表详情：</p>
            {procureDetails && <ShowDetails data={procureDetails} />}
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
            <button 
                onClick={handleSubmit}
                disabled={state}
                title={state ? "审核已完成，不可重复审核。" : ""}
            >
                确认审核 
            </button>
        </Modal>
    );
};


