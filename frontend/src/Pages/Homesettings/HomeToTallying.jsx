import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { initialEMPLOYEE, initialVIP,initialINVENTORY,initialPRODUCTS } from '../../utils/initial';


export default function HomeFormToTallying(){
    useEffect(() => {
        initialVIP();
        initialEMPLOYEE();
        initialINVENTORY();
        initialPRODUCTS();
    }, []);

    return(
        <div>
        <Link to='/outproducts'>出库申报</Link>
        {/* <br/>
        <Link to='/tallyingstaffhome/outlistfortallying'>出库申报列表</Link> */}
        </div>
    );
}