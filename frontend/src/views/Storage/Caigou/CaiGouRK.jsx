import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { getLocalStorage } from '../../../components/localstorage';
import { ProcurementInfo } from '../dashtable';
import { InboundRecordsApiPro } from '../../../api/storage';
import { CheckData } from '../dashtable';



export const PutinModal = ({ isOpen, onRequestClose, procureDetails, onSubmit}) => {
    const quantity = procureDetails.cGQuantity
    const [putinQuantities, setPutinQuantities] = useState(quantity);
    const [putinResult, setPutinResult] = useState("通过");
    const [putinOpinion, setPutinOpinion] = useState("");
    const [CheckDetails, setCheckDetails] = useState();
    const [error, setError] = useState(null);
    const [time,setTime]=useState(new Date());
    const[status,setStatus]=useState(false);

    const record_id = procureDetails.recordID
    const handler = getLocalStorage('session',true).name;


    //入库审核的时候要看审核时候的数据
    useEffect (()=>{
        const fetchCheckData=() => {
            try{
                InboundRecordsApiPro.getinfo({
                    params:{search_id:record_id}
                }).then((res)=>{
                    console.log('recordsdata',res.data);
                    const updatedetais={
                        checkDate:res.data[0].checkDate,
                        checkOpinion:res.data[0].checkOpinion,
                        checkResult:res.data[0].checkResult,
                        checkStaffID:res.data[0].checkStaffID,
                        checkStaffName:res.data[0].checkStaffName,
                       
                    }
                    setCheckDetails(updatedetais);
                })
            }catch(error){
                console.log(error);
            }
        }

        fetchCheckData();

    },[])
    const handleSubmit = () => {

        const putinData = {
            StorehouseStaffID: 10,
            StorehouseStaffName:handler,
            PutINResult: putinResult,
            PutinOpinion: putinOpinion,
            PutInQuantities: putinQuantities, 
            PutInDate:time,
        };
        const action="rk";

        onSubmit(putinData,action,record_id);
    };



    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
        <div className="container mt-4">
            <h2 className="text-center">入库确认</h2>
            {procureDetails&&<ProcurementInfo Results={procureDetails}/>}
            <hr />
            <p>审核详请</p>
            {CheckDetails&&<CheckData Results={CheckDetails}/>}
            <hr/>
            <div className="form-group">
                <label htmlFor="putinResult">入库结果:</label>
                <select 
                    id="putinResult" 
                    className="form-control" 
                    value={putinResult} 
                    onChange={(e) => setPutinResult(e.target.value)}
                >
                    <option value="通过">通过</option>
                    <option value="不通过">不通过</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="putinQuantities">入库数量（默认为申报数量）:</label>
                <input
                    type="number"
                    id="putinQuantities"
                    className="form-control"
                    value={putinQuantities}
                    onChange={(e) => setPutinQuantities(parseFloat(e.target.value) || quantity)} // 确保输入为数字
                />
            </div>
            <div className="form-group">
                <label htmlFor="putinOpinion">备注:</label>
                <textarea
                    id="putinOpinion"
                    className="form-control"
                    value={putinOpinion}
                    onChange={(e) => setPutinOpinion(e.target.value)}
                    placeholder="如需备注，请在此填写"
                />
            </div>
            <div className="form-group">
                <label htmlFor="checkDate">入库时间:</label>
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
                <button className="btn btn-primary mx-4"
                 onClick={handleSubmit}
                 >确认入库</button>
            </div>
        </div>
        </Modal>
    );
};
