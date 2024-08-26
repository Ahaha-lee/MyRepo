import {Link, useNavigate } from 'react-router-dom';
import useSession from '../../hooks/useSession';
import { useEffect } from 'react';
import { initialCAIGOUSB, initialCATEGORY, initialINVENTORY, initialPRODUCTS, initialSUPPLIERS, initialVIP } from '../../utils/initial';

export default function HomeForm() {
    const navigate = useNavigate();
    const { getSession } = useSession();
    const user = getSession();

    useEffect(() => {
        initialVIP();
        initialPRODUCTS();
        initialCATEGORY();
        initialINVENTORY();
        initialSUPPLIERS();
        initialCAIGOUSB();
        if (!user) {
            navigate("/login")
        }
    }, [user])

    return (
        <div>
            Welcome to 顶呱呱
            <br/>
            <Link to='/payment'>收银</Link>
            <br/>
            <Link to='/pointsformanager'>管理积分(管理员)</Link>
            <br/>
            <Link to='/pointsforcashier'>积分查询(收银员)</Link>
            <br/>
            <Link to='/addvipmembers'>会员注册</Link>
            <br/>
            <Link to='/deletvipmemers'>会员注销</Link>
            <br/>
            <Link to='/applyforcaigou'>采购申报</Link>
            <br/>
            <Link to='/checkforcaigou'>采购申报审核</Link>
        </div>
    )
}