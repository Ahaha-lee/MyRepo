import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

function RegisterSrForm(){
    const[rgi_username,setrgi_username]=useState('');
    const[rgi_password,setrgi_password]=useState('');
    const[confirmpassword,setconfrimpassword]=useState('');
    const[agree,setagree]=useState(false);
    const navigate = useNavigate();
    function handleRegisterClick(event){
        event.preventDefault(); // 阻止表单的默认提交行为(即靠浏览器页面刷新来提交表单)
        console.log("注册表单提交成功")
        //验证注册账号时候已存在
        if(rgi_password!==confirmpassword)
        {
            alert("两次密码输入不一致！")
        }
        if(rgi_username!=="Tom" && rgi_password !==123466)
        {
            //注册成功，跳转至登陆页面登录
            //注意：注册成功的提示
            navigate('/login');
        }
        else{
            alert("账号已存在请直接登录")
        }
        if(!agree)
        {
            alert("您还未勾选条款")
        }
    }
    return(
        <form onSubmit={handleRegisterClick}>
            <h1>注册</h1>
            <div className="input-box-Login">
                <input type="text" placeholder="账号" required value={rgi_username} onChange={e=>setrgi_username(e.target.value)}></input>
            </div>
            <div className="input-box-Login">
                <input type="password" placeholder="设置密码" required value={rgi_password} onChange={e=>setrgi_password(e.target.value)}></input>
            </div>
            <div className="input-box-Login">
                <input type="password" placeholder="确认密码" required value={confirmpassword} onChange={e=>setconfrimpassword(e.target.value)}></input>
            </div>
            <div className="Agreemwent-check">
                <label>
                    <input type="checkbox"  value={agree} onChange={e=>setagree(e.target.value)}/>我已阅读并且接受以下条款：
                </label>
            </div>
            <button className="submit-Login">注册</button>
            <div className="link-Login">
                <p>已有账号直接<Link to="/Login">登录</Link></p>
            </div>
        </form>
    )
}

export default  RegisterSrForm;
