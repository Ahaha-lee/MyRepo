import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { initialCAIGOUTOEXI, initialCAIGOUTONOTEXI, initialEMPLOYEE, initialVIP,initialINVENTORY,initialPRODUCTS } from '../../utils/initial';

export default function HomeFormToCGStaff() {
    useEffect(() => {
        initialVIP();
        initialCAIGOUTOEXI();
        initialCAIGOUTONOTEXI();
        initialEMPLOYEE();
        initialINVENTORY();
        initialPRODUCTS();
    }, []);

    return (
        <div>
            Welcome to 顶呱呱
            <br />
            <Link to='/applyforcaigou'>采购申报</Link>
            <br/>
            <Link to='/caigoulistfotcgstaff'>采购申报列表</Link>
            <br/>
            <Link to='/caigoustaffhome/cgcheckfeedback'>采购申报结果查询</Link>
            <br/>
        </div>
    );
}
