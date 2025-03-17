import { Component, useState } from "react";
import { LoginApi } from "../../api/login";
import { setLocalStorage } from "../../components/localstorage";
import { initialSession } from "../../components/initial/ini_login";
import React from "react";
import { useNavigate } from "react-router-dom";

export class LoginPage extends Component {
    componentDidMount() {
        // 在组件挂载时调用 initialSession 来初始化会话
        initialSession();
    }
    render() {
        return (
        <div className="row">
            <div className="col-4"></div>
            <div className="col-4">
                <div className="d-flex justify-content-center align-items-center"  style={{ height: '80vh' }}>
                    <LoginForm />
                </div>
            </div>
            <div className="col-4"></div>
          </div>
        ); 
    }
}

function LoginForm() {
    const [state, setState] = useState({
        name: '',
        employeeID: '',
        password: '',
        errors: '',
        account: '',
    });
    const navigate = useNavigate();

    const alertErrors = () => {
        if (state.errors) {
            window.alert(state.errors);
        }
    }

    const userdata = (data) => {
        setLocalStorage('session', data, true);
    }

    const onsubmit = (e) => {
        e.preventDefault();
        LoginApi.login({
            employeeID: Number(state.employeeID),
            password: state.password,
        })
        .then(res => {
            console.log("登录返回数据", res);
            userdata(res.user);
            if (res.user.name==="Tom" ) {
                navigate("/admin"); // 登录成功后跳转到 /admin}else 
            }else if (res.user.name ==="Jerry" )
            {
                navigate("/payment/cash");
            }
        })
        .catch(error => {
            console.log("请求错误", error);

            if (error.response && error.response.data) {
                setState(prevState => ({
                    ...prevState,
                    errors: error.response.data.errormessage
                }));
                alertErrors();
                console.log("错误信息 state.errors:", state.errors);
            }
        });
    }

    const registerHandle = (e) => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const { name, password, employeeID } = state;
    return (
        <div style={{ width: '80%' }}>
            <h3 className="text-center">顶呱呱收银系统</h3>
            <form onSubmit={onsubmit}>
                <div className="mb-3">
                    <label htmlFor="employeeID" className="form-label">账号：</label>
                    <input
                        type="text"
                        className="form-control"
                        id="employeeID"
                        name="employeeID"
                        value={employeeID}
                        placeholder="请输入注册账号"
                        onChange={registerHandle}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">密码：</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={password}
                        placeholder="请输入注册密码"
                        onChange={registerHandle}
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-lg btn-block">登录</button>
            </form>
        </div>
    );
}