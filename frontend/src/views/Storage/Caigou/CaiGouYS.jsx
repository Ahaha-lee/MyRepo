import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { getLocalStorage } from '../../../components/localstorage';
import { ProcurementInfo } from '../dashtable';
import { InboundRecordsApiPro} from '../../../api/storage';
import { CheckData, PutinData } from '../dashtable';
import { InventoryApi } from '../../../api/storage/inventory';

export const ExamineModal = ({ isOpen, onRequestClose, procureDetails, onSubmit }) => {
    const [examineQuantities, setExamineQuantities] = useState();
    const [checkDetails, setCheckDetails] = useState();
    const [putinDetails, setPutinDetails] = useState();
    const [error, setError] = useState(null);
    const [examineResult, setExamineResult] = useState("通过");
    const [examineOpinion, setExamineOpinion] = useState("");
    const handler = getLocalStorage('session', true).name;
    const [time, setTime] = useState(new Date());
    const record_id = procureDetails.recordID;
    const [status, setStatus] = useState();

    const handleSubmit = async () => {
        const examineData = {
            ExamineStaffID: 10,
            ExamineStaffName: handler,
            ExamineResult: examineResult,
            ExamineQuantities: examineQuantities,
            ExamineOpinion: examineOpinion,
            ExamineDate: time,
        };
        const action = "ys";
        await onSubmit(examineData, action, record_id);
        if (examineResult === "通过") {
            await updateInventory(procureDetails, examineQuantities); // 更新库存信息
        }
    };

    const updateInventory = async (procureDetails, quantities) => {
      
        try {
            console.log("更新库存信息",procureDetails,quantities)
            const updatedProductData = {
                Stockall_quantity: quantities,
                Stocknow_quantity: quantities,
                Stockout_quantity: 0,
            };
            console.log("修改商品库存信息",updatedProductData);
            const res = await InventoryApi.updatequantities({
                params: {update_id:procureDetails.barcode},
                data: updatedProductData
            });

            console.log("修改商品库存数量信息成功", res);
        } catch (error) {
            console.error('库存信息数量更新失败:', error);
        }
    };


    useEffect(() => {
        const fetchCheckData = () => {
            try {
                InboundRecordsApiPro.getinfo({
                    params: { search_id: record_id }
                }).then((res) => {
                    const updatedetais = {
                        checkDate: res.data[0].checkDate,
                        checkOpinion: res.data[0].checkOpinion,
                        checkResult: res.data[0].checkResult,
                        checkStaffID: res.data[0].checkStaffID,
                        checkStaffName: res.data[0].checkStaffName,
                    };
                    setCheckDetails(updatedetais);

                    const updatedetais2 = {
                        storehouseStaffID: res.data[0].storehouseStaffID,
                        storehouseStaffName: res.data[0].storehouseStaffName,
                        putInResult: res.data[0].putInResult,
                        putInOpinion: res.data[0].putInOpinion,
                        putInQuantities: res.data[0].putInQuantities,
                        putInDate: res.data[0].putInDate,
                    };
                    setExamineQuantities(res.data[0].putInQuantities);
                    setPutinDetails(updatedetais2);
                });
            } catch (error) {
                console.log(error);
            }
        };

        fetchCheckData();
    }, [record_id]);

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <div className="container mt-4">
                <h2 className="text-center">验收确认</h2>
                {procureDetails && <ProcurementInfo Results={procureDetails} />}
                <hr />
                <p>审核详情</p>
                {checkDetails && <CheckData Results={checkDetails} />}
                <hr />
                <p>入库验收详情</p>
                {putinDetails && <PutinData Results={putinDetails} />}
                <hr />
                <div className="form-group">
                    <label htmlFor="examineResult">验收结果:</label>
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
                    <label htmlFor="examineQuantities">验收数量（默认为入库数量）:</label>
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
                    <br />
                    <button className="btn btn-primary mx-4" onClick={onRequestClose}>取消</button>
                    <button className="btn btn-primary mx-4" onClick={handleSubmit}>确认验收</button>
                </div>
            </div>
        </Modal>
    );
};