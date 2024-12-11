import Modal from 'react-modal';
import { CheckData, ExamineData, OutDeclarationInfo } from '../dashtable';

export function  InfoModal({isOpen, onRequestClose, outdeclarationDetails}){
    return(
        <div>
              <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
                <OutDeclarationInfo  Results={ outdeclarationDetails} />
              </Modal>
        </div>
    );

}



//包含了记录信息
export function InfoModalPro({isOpen, onRequestClose, outdeclarationDetails,records}){
  console.log(records)

  const checkdata={
    checkDate:records.checkDate,
    checkOpinion:records.oCheckOpinion,
    checkResult:records.oCheckResult,
    checkStaffID:records.oCheckStaffID,
    checkStaffName:records.oCheckStaffName,    
  }
 
  const outdata={
    StaffID:records.oStoreHouseStaffID,
    StaffName:records.oStoreHouseStaffName,
    Result:records.oStoreHouseResult,
    Opinion:records. oStoreHouseOpinion,
    Quantities:records.outQuantities,
    Date:records.outDate,
  }
  return(
  <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
    <OutDeclarationInfo  Results={ outdeclarationDetails} />
    <hr/>
    <span>申请表审核详情：</span>
    <CheckData Results={checkdata}/>
    <hr/>
    <span>申请表出库审核详情：</span>
    <ExamineData Results={outdata}/>
  </Modal>
  )
}