import { Link } from 'react-router-dom';
import React from 'react';


export function VIPMembersForm() {
    return (
        <div>
           <Link to="/vip/addvip">会员注册</Link><br/>
           <Link to="/vip/deletevip">会员注销</Link><br/>
        </div>
    );

}