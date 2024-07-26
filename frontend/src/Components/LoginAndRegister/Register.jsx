import React from "react";
import { Link } from 'react-router-dom';

function RegisterForm(){
    return(
        <form className="wrapper-Register">
            <h1>注册</h1>
            <div className="input-box-Login">
                <input type="text" placeholder="待定" required></input>
            </div>
            <div className="input-box-Login">
                <input type="password" placeholder="设置密码" required></input>
            </div>
            <div className="input-box-Login">
                <input type="password" placeholder="确认密码" required></input>
            </div>
            <div className="Agreemwent-check">
                <label>
                    <input type="checkbox"/>我已阅读并且接受以下条款：
                </label>
            </div>
            <button className="submit-Login">注册</button>
            <div className="link-Login">
                <p>已有账号直接<Link to="/Login">登录</Link></p>
            </div>
        </form>
    )
}

export default RegisterForm;
