import React from "react";
import { useState } from "react";
import { FaUser,FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import './Login.css';

function LoginForm(){
    //用username，password 存储用户输入的账号和密码
   const [username,setusername]=useState('');
   const [password,setpassword]=useState('');
   const [psdremeber,setpsdremeber]=useState('')
   const [verification,setverification]=useState(false)
  // 后端数据库验证为真返利用setverification传给handleLoginClick()
function handleLoginClick(event){
    event.preventDefault(); // 阻止表单的默认提交行为(即靠浏览器页面刷新来提交表单)
    console.log("表单提交成功")
    // 验证逻辑：后端数据库验证为真返利用setverification传给handleLoginClick()？？？？


    if(verification){//提问：这里的verification是更新以后的吗？
        console.log("Login success")
    }
    else{
        console.log("Login failed")
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
                    <input type="text" placeholder="账号" required onChange={e => setusername(e.target.value)}/>
                    <FaUser className="icons"/> 
                </div>
                <div className="input-box-Login">
                    <input type="password" placeholder="密码" required onChange={e => setpassword(e.target.value)}/>
                    <FaLock className="icons" />
                </div>
                <div className="setForpsd-Login">
                    <label>
                        <input type="checkbox" onChange={e=>setpsdremeber(e.target.checked)}/>记住密码
                    </label>
                    <Link to="/ForgetPassword">忘记密码</Link>
                </div>
                {/* onClick={handleLoginClick}点击按钮是调用函数 */}
                <button className="submit-Login" >登录</button>
                <div className="link-Login">
               <p>没有账号 <Link to="/Register">注册</Link></p>
                </div>
            </div>
            </div>
        </form>
    );
}

export default LoginForm;


