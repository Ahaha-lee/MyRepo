import {Link, useNavigate } from 'react-router-dom';
import useSession from '../../hooks/useSession';
import { useEffect } from 'react';

export default function Dashboard() {
    const navigate = useNavigate();
    const { getSession } = useSession();
    const user = getSession();

    useEffect(() => {
        if (!user) {
            navigate("/login")
        }
    }, [user])

    return (
        <div>
            Welcome to 顶呱呱
            <Link to='/payment'>收银</Link>
            <Link to='/vipPoints'>会员管理</Link>
        </div>
    )
}