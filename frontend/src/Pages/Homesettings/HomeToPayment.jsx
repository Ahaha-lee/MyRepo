import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { initialEMPLOYEE, initialVIP,initialINVENTORY,initialPRODUCTS } from '../../utils/initial';


export default function HomeFormToPayment(){
    useEffect(() => {
        initialVIP();
        initialEMPLOYEE();
        initialINVENTORY();
        initialPRODUCTS();
    }, []);

    return(
        <div>
        <Link to='/searchvipdata'>会员查询</Link>
        <br/>
        <Link to='/addvipmembers'>注册会员</Link>
        <br/>
        <Link to='/deletvipmemers'>删除会员</Link>
        </div>
    );
}