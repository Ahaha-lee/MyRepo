import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import {initialEMPLOYEE, initialVIP,initialINVENTORY,initialPRODUCTS } from '../../utils/initial';

export default function HomeFormToStorage() {
    useEffect(() => {
        initialEMPLOYEE();
        initialINVENTORY();
    }, []);

    return (
        <div>
            Welcome to 顶呱呱
           
            <br/>
            <Link to='/storagestaffhome/cgistforstorstaff'>采购申报入库审核</Link>
            <br/>
            <Link to='/storagestaffhome/outistforstorstaff'>出库申报出库审核</Link>
            <br/>
        </div>
    );
}
