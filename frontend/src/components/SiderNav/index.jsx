import React from 'react'
import useSession from '../../utils/useSession';

export function SiderNav () {
    var name
     const {getSession}=useSession();
     if(getSession()){
      name=getSession().name
     }
    return (
        <div>
            { name !=''?(
            <ul className="nav flex-column">
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/admin">首页</a>
                </li>
                <li className="nav-item">
                    <a class="nav-link" href="/vip">会员</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/storage">库存</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">收银</a>
                </li>
            </ul>):('')}
        </div>
    )
}