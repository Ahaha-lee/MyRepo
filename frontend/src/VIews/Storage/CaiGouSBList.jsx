import { CGEXISTEDKEY, CGNOTEXISTEDKEY } from "../../Mock/inventoryMock";
import { getLocalStorage } from "../../utils/storageways";
import { useNavigate } from "react-router-dom"; 

export function CGList() {
    const navigate = useNavigate(); 
    const existed = getLocalStorage(CGEXISTEDKEY, true);
    const notExisted = getLocalStorage(CGNOTEXISTEDKEY, true);

    const handleNavigate = (recordid, type) => {
        if (type === 'review') {
            navigate(`/checkforcaigou/${recordid}`); // 跳转到审核页面
        } else if(type==='acceptance') {
            navigate(`/acceptanceforcaigou/${recordid}`); // 跳转到验收页面
        }else if(type==='putin'){
            navigate(`/putinforcaigou/${recordid}`);//跳转到入库页面
        }
    };

    return (
        <>
            采购申报列表：
            <ul>
                {existed.map(item => (
                    <li key={item.recordid}>
                        {`${item.title} (ID: ${item.recordid})`}
                        <button onClick={() => handleNavigate(item.recordid, 'review')}>审核</button>&nbsp;
                        <button onClick={() => handleNavigate(item.recordid, 'putin')}>入库</button>&nbsp;
                        <button onClick={() => handleNavigate(item.recordid, 'acceptance')}>验收</button>

                    </li>
                ))}
            </ul>
            <ul>
                {notExisted.map(item => (
                    <li key={item.recordid}>
                        {`${item.title} (ID: ${item.recordid})`}
                        <button onClick={() => handleNavigate(item.recordid, 'review')}>审核</button>&nbsp;
                        <button onClick={() => handleNavigate(item.recordid, 'putin')}>入库</button>&nbsp;
                        <button onClick={() => handleNavigate(item.recordid, 'acceptance')}>验收</button>


                    </li>
                ))}
            </ul>
        </>
    );
}
