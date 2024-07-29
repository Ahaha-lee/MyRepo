import React from "react";
import { useState } from "react";
import { FaUser,FaLock } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import useSession from "../../hooks/useSession";

function LoginForm(){
    //用username，password 存储用户输入的账号和密码
   const [username,setusername]=useState('');
   const [password,setpassword]=useState('');
   const [psdremeber,setpsdremeber]=useState('');
   const navigate = useNavigate();
   const { handleSession } = useSession();


  // 后端数据库验证为真返利用setverification传给handleLoginClick()
    function handleLoginClick(event){
        event.preventDefault(); // 阻止表单的默认提交行为(即靠浏览器页面刷新来提交表单)
        console.log("登录提交成功")
        // 发送一个请求
        // fetch("http://127.0.0.1:8000/login", {body: JSON.stringify({username, password})}).then
        if (username === "Tom" && password === "123456") {
            // 账号密码正确
            // -> 跳转
            console.log({username, password})
            handleSession({username, email: "lsw@qq.com", phone: "123123213"})
            navigate('/');
        } else {
            // 账号或密码错误
            // 提示错误
            alert("账号或密码错误")
        }
    }

   return(
        <form onSubmit={handleLoginClick}>
            <div className="wrapper-Login">
                {/* 账号密码更新？ */}
                <div className="wrapperforinput-Login">
                <h1>登录</h1>
                <div className="input-box-Login">
                    {/*e事件对象 当输入值改变时，e.target 就会是这个 <input> 元素。，e.targe.value<input>元素中的当前值(实时更新状态值) */}
                    <input type="text" placeholder="账号" required value={username} onChange={e => setusername(e.target.value)}/>
                    <FaUser className="icons"/> 
                </div>
                <div className="input-box-Login">
                    <input type="password" placeholder="密码" required value={password} onChange={e => setpassword(e.target.value)}/>
                    <FaLock className="icons" />
                </div>
                <div className="setForpsd-Login">
                    <label>
                        <input type="checkbox" />记住密码
                    </label>
                    <Link to="/forgetPassword">忘记密码</Link>
                </div>
                {/* onClick={handleLoginClick}点击按钮是调用函数 */}
                <button className="submit-Login">登录</button>
                <div className="link-Login">
               <p>没有账号 <Link to="/register">注册</Link></p>
                </div>
            </div>
            </div>
        </form>
    );
}

export default LoginForm;