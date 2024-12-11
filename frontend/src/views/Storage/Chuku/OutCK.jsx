import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { getLocalStorage } from '../../../components/localstorage';
import { OutDeclarationInfo,CheckData} from '../dashtable';
import { OutboundRecordsApiPro} from '../../../api/storage';

export const OutModal = ({ isOpen, onRequestClose, outdeclarationDetails, onSubmit, state, laststate, firststate }) => {
    const [examineQuantities, setExamineQuantities] = useState(0); 
    const [examineResult, setExamineResult] = useState("通过");
    const [examineOpinion, setExamineOpinion] = useState("");
    const handler = getLocalStorage('session',true).name
    const [time,setTime]=useState(new Date());
    const[checkDate,setCheckDate]=useState()
    const record_id=outdeclarationDetails.recordID;

    
    const handleSubmit = async () => {
        const examineData = {
            OStoreHouseStaffID:10  ,
            OStoreHouseStaffName:handler,
            OStoreHouseResult:examineResult,
            OStoreHouseOpinion:examineOpinion,
            OutDate:time  ,
        };
        const action ="ck";
        onSubmit(examineData,action,record_id);
    };


    useEffect (()=>{
        const fetchCheckData=() => {
            try{
                OutboundRecordsApiPro.getinfo({
                    params:{search_id:record_id}
                }).then((res)=>{
                    console.log('recordsdata',res.data);
                    const updatedetais={
                        checkDate:res.data[0].checkDate,
                        checkOpinion:res.data[0].oCheckOpinion,
                        checkResult:res.data[0].oCheckResult,
                        checkStaffID:res.data[0].oCheckStaffID,
                        checkStaffName:res.data[0].oCheckStaffName,
                       
                    }
                    setCheckDate(updatedetais);
                })
            }catch(error){
                console.log(error);
            }
        }

        fetchCheckData();

    },[])

    
    

  
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
         <div className="container mt-4">
            <h2 className="text-center">出库确认</h2>
            {outdeclarationDetails && <OutDeclarationInfo Results={outdeclarationDetails}/>}            

            <hr/>
            <p>审核详情</p>
            {checkDate && <CheckData Results={checkDate}/>}
            <hr/>
            <div className="form-group">
                <label htmlFor="examineResult">出库结果:</label>
                <select 
                    id="examineResult" 
                    className="form-control" 
                    value={examineResult} 
                    onChange={(e) => setExamineResult(e.target.value)}
                >
                    <option value="通过">通过</option>
                    <option value="不通过">不通过</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="examineQuantities">出库数量（默认为审核申报数量）:</label>
                <input
                    type="number"
                    id="examineQuantities"
                    className="form-control"
                    value={examineQuantities}
                    onChange={(e) => setExamineQuantities(parseFloat(e.target.value))} // 确保输入为数字
                />
            </div>
            <div className="form-group">
                <label htmlFor="examineOpinion">备注:</label>
                <textarea
                    id="examineOpinion"
                    className="form-control"
                    value={examineOpinion}
                    onChange={(e) => setExamineOpinion(e.target.value)}
                    placeholder="如需备注，请在此填写"
                />
            </div>
            <div className="form-group">
                <label htmlFor="checkDate">出库时间:</label>
                <input
                    type="text"
                    id="checkDate"
                    className="form-control"
                    value={time.toLocaleString()}
                    onChange={(e) => setTime(e.target.value)}
                    readOnly
                />
            </div>
            <div className="text-center">
                <br/>
                <button className="btn btn-primary mx-4" onClick={onRequestClose}>取消</button>
                <button className="btn btn-primary mx-4" onClick={handleSubmit}>确认验收</button>
            </div>
        </div>
        </Modal>
    );
};
