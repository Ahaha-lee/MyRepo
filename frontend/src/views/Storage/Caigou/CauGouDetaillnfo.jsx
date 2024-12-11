import React from 'react';
import Modal from 'react-modal';
import { ProcurementInfo,CheckData, PutinData,ExamineData} from '../dashtable';

//CaiGouOperation View的InfoModal
export function  InfoModal({isOpen, onRequestClose, procureDetails}){
    return(
        <div>
            
              <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
                <ProcurementInfo Results={procureDetails} />
              </Modal>
        </div>
    );

}


//ProcurementInfo（采购信息）
export  function InfoModalPro({isOpen, onRequestClose, procureDetails,records}){
    console.log("records",records)
  const checkdata={
    checkDate:records.checkDate,
    checkOpinion:records.checkOpinion,
    checkResult:records.checkResult,
    checkStaffID:records.checkStaffID,
    checkStaffName:records.checkStaffName,
  }

  const  putindata={
    storehouseStaffID:records.storehouseStaffID,
    storehouseStaffName:records.storehouseStaffName,
    putInResult:records.putINResult,
    putInOpinion:records.putInOpinion,
    putInQuantities:records.putInQuantities,
    putInDate:records.putInDate,
  }

  const examineData={
    StaffID    :records.examineStaffID,
    StaffName:records.examineStaffName,
    Result:records.examineResult,
    Opinion:records. examineOpinion,
    Quantities:records. examineQuantities,
    Date:records.examineDate,
  }
  return(
  <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
     <ProcurementInfo Results={procureDetails} />
    <hr/>
    <span>申请表审核详情：</span>
    <CheckData Results={checkdata}/>
    <hr/>
    <span>申请表入库审核详情：</span>
    <PutinData Results={putindata}/>
    <hr/>
    <span>申请表验收审核详情：</span>
    <ExamineData Results={examineData}/>
  </Modal>
  )
}