import {Link, useNavigate } from 'react-router-dom';
import useSession from '../../hooks/useSession';
import { useEffect } from 'react';
import { initialCGcheck, initialCgExamine, initialCGPutin, initialEMPLOYEE, initialINVENTORY, initialOut, initialOutcheck } from '../../utils/initial';

export default function HomeForm() {
    const navigate = useNavigate();
    const { getSession } = useSession();
    const user = getSession();

    useEffect(() => {
        initialCGcheck();
        initialCGPutin();
        initialCgExamine()
        initialOut();
        initialOutcheck();
        initialEMPLOYEE();
        initialINVENTORY();

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
            <Link to='/applyforcaigou'>采购申报（后端）</Link>
            <br/>
            <Link to='/caigoulist'>采购列表（1/3后端）</Link>
            <br/>
            <Link to= '/checkforcaigou'>采购验收</Link>
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