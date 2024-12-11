import { Link } from 'react-router-dom';
import { VIPDashForm } from './VIPInfoDash';
import React from 'react';
import MainLayout from '../../utils/MainLayOut/MainLayout'

export function MembersPage() {
   return(
    <div>
      <MainLayout rightContent={<VIPMembersForm/>}></MainLayout>
    </div>
   )
}
export function VIPDashboardPage() {
    return(
        <MainLayout rightContent={<VIPDashForm/>}></MainLayout>
    )
 }

export function VIPMembersForm() {
    return (
        <div>
           <Link to="/vip/addvip">会员注册</Link><br/>
           <Link to="/vip/deletevip">会员注销</Link><br/>
        </div>
    );

}