import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import {initialEMPLOYEE, initialVIP,initialINVENTORY,initialPRODUCTS } from '../../utils/initial';

export default function HomeFormToCGStaff() {
    useEffect(() => {
        initialVIP();
        initialEMPLOYEE();
        initialINVENTORY();
        initialPRODUCTS();
    }, []);

    return (
        <div>
            Welcome to 顶呱呱
            <br />
            <Link to='/applyforcaigou'>采购申报</Link>
            {/* <br/>
            <Link to='/caigoustaffhome/caigoulistfotcgstaff'>采购申报列表</Link>
            <br/> */}
        </div>
    );
}
