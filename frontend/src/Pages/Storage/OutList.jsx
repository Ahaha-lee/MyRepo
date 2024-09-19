import { OUTAPPLYKEY, OUTPRODUCTSKEY, OUTRECORDKEY } from "../../Mock/inventoryMock";
import { getLocalStorage } from "../../utils/storageways";
import { useNavigate } from "react-router-dom"; 

// 顶级boss下的出库申报列表
export function OutList() {
    const navigate = useNavigate(); 
    const inioutproduct = getLocalStorage(OUTAPPLYKEY, true);

    const canNavigate = (item, type) => {
        switch (type) {          
            case 'out':
                return item.CheckResult === 'yes'; // 只有出库为yes时可以导航
            default:
                return false;
        }
    };

    const handleNavigate = (outrecordid, type) => {
            switch (type) {
                case 'check':
                    navigate(`/checkforoutproducts/${outrecordid}`);
                    break;
                case 'out':
                    navigate(`/outforoutproducts/${outrecordid}`);
                    break;
                default:
                    break;
            }
    };
    
    if (!inioutproduct || inioutproduct.length === 0) {
        return <div>没有采购申报记录。</div>;
    }

    return (
        <>
            <h2>采购申报列表：</h2>
            <ul>
                {inioutproduct.map(item => (
                    <li key={item.OutRecordID }>
                        {`${item.Title} (ID: ${item.OutRecordID })`}
                        <button 
                            onClick={() => handleNavigate(item.OutRecordID , 'check')} 
                        >
                            审核
                        </button>&nbsp;
                        <button 
                            onClick={() => handleNavigate(item.OutRecordID , 'out')} 
                            disabled={!canNavigate(item, 'out')}
                        >
                            出库
                        </button>&nbsp;
                    </li>
                ))}
            </ul>
        </>
    );
}
