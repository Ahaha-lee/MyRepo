import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

function LoginForm({ handleSession }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function handleLoginClick(event) {
        event.preventDefault(); // 阻止表单的默认提交行为

        if (username === "Tom" && password === "123456") {
            handleSession({ staffId: "E005", username: 'Tom', email: "lsw@qq.com", phone: "123123213", role: '顶级boss' });
            navigate('/');
        } else if (username === '蕉太狼' && password === '456789') {
            handleSession({ staffId:"E003",username: '蕉太狼', email: "Jeerry@qq.com", phone: "645", role: '采购专员' });
            navigate('/caigoustaffhome');
        } else {
            alert("账号或密码错误");
        }
    }

    return (
        <form onSubmit={handleLoginClick}>
            <div className="wrapper-Login">
                <div className="wrapperforinput-Login">
                    <h1>登录</h1>
                    <div className="input-box-Login">
                        <input type="text" placeholder="账号" required value={username} onChange={e => setUsername(e.target.value)} />
                        <FaUser className="icons" />
                    </div>
                    <div className="input-box-Login">
                        <input type="password" placeholder="密码" required value={password} onChange={e => setPassword(e.target.value)} />
                        <FaLock className="icons" />
                    </div>
                    <div className="setForpsd-Login">
                        <label>
                            <input type="checkbox" />记住密码
                        </label>
                        <Link to="/forgetPassword">忘记密码</Link>
                    </div>
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
