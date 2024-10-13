import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { initialEMPLOYEE, initialVIP,initialINVENTORY,initialPRODUCTS } from '../../utils/initial';


export default function HomeFormToTallying(){
    useEffect(() => {
        
        initialEMPLOYEE();
        initialINVENTORY();
       
    }, []);

    return(
        <div>
        <Link to='/outproducts'>出库申报</Link>
        <br/>
        <Link to='/tallyingstaffhome/outlistfortallyclerk'>出库申报反馈列表</Link>
        </div>
    );
}