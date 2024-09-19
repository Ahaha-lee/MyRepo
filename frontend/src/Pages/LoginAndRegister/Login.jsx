import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

const users = {
    "Tom": {
        EmployeeID: "Em001",
        FirstName: "T",
        LastName: "om",
        Position: "顶级boss",
        Phone: "111222333441",
        Gender: "女",
        LoginPassword: "123456",
        BirthDate: "2003-12-25",
        DateOfEntry: "2024-07-23",
        PositionState: "在职",
        redirect: '/'
    },
    "蕉太狼": {
        EmployeeID: "Em002",
        FirstName: "蕉",
        LastName: "太狼",
        Position: "采购专员",
        Phone: "111222333442",
        Gender: "男",
        LoginPassword: "456789",
        BirthDate: "1999-01-01",
        DateOfEntry: "2024-07-24",
        PositionState: "在职",
        redirect: '/caigoustaffhome'
    },
    "大灰灰": {
        EmployeeID: "Em003",
        FirstName: "大",
        LastName: "灰灰",
        Position: "收银员",
        Phone: "111222333443",
        Gender: "男",
        LoginPassword: "101112",
        BirthDate: "1999-09-02",
        DateOfEntry: "2024-08-24",
        PositionState: "在职",
        redirect: '/paymentstaffhome'
    },
    "灰太狼": {
        EmployeeID: "Em004",
        FirstName: "灰",
        LastName: "太狼",
        Position: "仓库管理员",
        Phone: "111222333443",
        Gender: "男",
        LoginPassword: "131415",
        BirthDate: "1999-09-02",
        DateOfEntry: "2024-08-24",
        PositionState: "在职",
        redirect: '/tallyingstaffhome'
    }
};

function LoginForm({ handleSession }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    function handleLoginClick(event) {
        event.preventDefault(); // 阻止表单的默认提交行为

        const user = users[username];

        if (user && user.LoginPassword === password) {
            console.log(`登录成功：${username}`);
            handleSession(user);
            console.log("正在导航到主页");
            navigate(user.redirect);
            console.log("导航函数已调用");
        } else {
            console.log("登录失败");
            setErrorMessage("账号或密码错误");
        }
    }

    return (
        <form onSubmit={handleLoginClick}>
            <div className="wrapper-Login">
                <div className="wrapperforinput-Login">
                    <h1>登录</h1>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <div className="input-box-Login">
                        <input 
                            type="text" 
                            placeholder="账号" 
                            required 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                        />
                        <FaUser className="icons" />
                    </div>
                    <div className="input-box-Login">
                        <input 
                            type="password" 
                            placeholder="密码" 
                            required 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                        />
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
