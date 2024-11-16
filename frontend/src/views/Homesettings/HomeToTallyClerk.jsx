import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { initialEMPLOYEE, initialVIP,initialINVENTORY,initialPRODUCTS } from '../../utils/storageini';


export default function HomeFormToTallying(){


    return(
        <div>
        <Link to='/outproducts'>出库申报</Link>
        <br/>
        <Link to='/tallyingstaffhome/outlistfortallyclerk'>出库申报反馈列表</Link>
        </div>
    );
}