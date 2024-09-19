import {Link, useNavigate } from 'react-router-dom';
import useSession from '../../hooks/useSession';
import { useEffect } from 'react';
import { initialEMPLOYEE, initialINVENTORY, initialPRODUCTS, initialVIP } from '../../utils/initial';

export default function HomeForm() {
    const navigate = useNavigate();
    const { getSession } = useSession();
    const user = getSession();

    useEffect(() => {
        initialVIP();
        initialEMPLOYEE();
        initialINVENTORY();
        initialPRODUCTS();
        if (!user) {
            navigate("/login");
        }
        console.log("账号使用者Data",user);
    }, [user, navigate]);


    return (
        <div>
            Welcome to 顶呱呱
            <br/>
            <Link to='/payment'>收银</Link>
            <br/>
            <Link to='/searchvipdata'>会员信息查询</Link>
            <br/>
            <Link to='/addvippoints'>会员积分添加</Link>
            <br/>
            <Link to='/deletevipoints'>会员积分删除</Link>
            <br/>
            <Link to='/addvipmembers'>会员注册（后端）</Link>
            <br/>
            <Link to='/deletvipmemers'>会员注销（后端）</Link>
            <br/>
            <Link to='/applyforcaigou'>采购申报</Link>
            <br/>
            <Link to='/caigoulist'>采购申请表</Link>
            <br/>
            <Link to='/outproducts'>出库申报</Link>
            <br/>
            <Link to='outlist'>出库申报列表</Link>

            <div>
                <Link to='/searchvipdata'>vip信息查询（后端）</Link>
                <br/>
                <Link to='/addvippoints'>vip积分修改（后端）</Link>
            </div>
        </div>
    )
}