import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import {initialEMPLOYEE, initialVIP,initialINVENTORY,initialPRODUCTS } from '../../utils/initial';

export default function HomeFormToCashier() {
    useEffect(() => {
        initialEMPLOYEE();
        initialINVENTORY();
    }, []);

    return (
        <div>
            Welcome to 顶呱呱
            <br />
            <Link to='/payment'>收银</Link>
            <br/>
            <Link to='/addvipmembers'>注册会员</Link>
            <br/>
        </div>
    );
}
