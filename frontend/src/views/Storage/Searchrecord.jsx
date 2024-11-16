import { useState, useEffect } from "react";
import { getLocalStorage } from "../../utils/storageways";
import { CHECKRESULTKEY } from "../../Mock/inventoryMock";

export function SearchRecord() { // 确保组件名称以大写字母开头
    const [searchRecordid, setSearchRecordid] = useState('');
    const [searchResult, setSearchResult] = useState(null); // 用于存储查找结果

    const handleChange = (event) => {
        setSearchRecordid(event.target.value);
    };

    useEffect(() => {
        const checkResults = getLocalStorage(CHECKRESULTKEY, true);
        const foundRecord = checkResults.find(item => item.recordid === searchRecordid);
        setSearchResult(foundRecord); // 更新查找结果
    }, [searchRecordid]); // 依赖于 searchRecordid

    return (
        <div>
            查询记录ID: <input type='text' value={searchRecordid} onChange={handleChange} /><br />
            <div>
                <table>
                    <tbody>
                        {searchResult ? (
                            <tr key={searchResult.recordid}>
                                <td>记录编号：{searchResult.recordid}</td>
                                <td>条形码：{searchResult.barcode}</td>
                                <td>商品名称：{searchResult.productname}</td>
                                <td>申请员工编号：{searchResult.applystaffId}</td>
                                <td>检查编号：{searchResult.checkId}</td>
                                <td>检查结果：{searchResult.checkResult}</td>
                                <td>审批意见：{searchResult.approvalopinion}</td>
                                <td>检查时间：{searchResult.checkTime}</td>
                                <td>验收结果：{searchResult.examineResult}</td>
                                <td>验收意见：{searchResult.acceptanceOpinion}</td>
                                <td>验收时间：{searchResult.examineTime}</td>
                                <td>入库数量：{searchResult.putinQuantities}</td>
                                <td>入库结果：{searchResult.putinResult}</td>
                                <td>入库时间：{searchResult.putinTime}</td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan="14">未找到记录</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
