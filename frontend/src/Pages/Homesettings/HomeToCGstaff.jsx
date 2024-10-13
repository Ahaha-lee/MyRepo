import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import {initialEMPLOYEE, initialVIP,initialINVENTORY,initialPRODUCTS } from '../../utils/initial';

export default function HomeFormToCGStaff() {
    useEffect(() => {
        initialEMPLOYEE();
        initialINVENTORY();
    }, []);

    return (
        <div>
            Welcome to 顶呱呱
            <br />
            <Link to='/applyforcaigou'>采购申报</Link>
            <br/>
            <Link to='/caigoustaffhome/cgistforcgstaff'>采购申报反馈</Link>
            <br/>
        </div>
    );
}
