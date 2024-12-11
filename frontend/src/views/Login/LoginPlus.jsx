import { Component } from "react";
import { LoginApi } from "../../api/login";
import { setLocalStorage } from "../../components/localstorage";
import { initialSession } from "../../components/initial/ini_login";
import React from "react";

export class LoginPage extends Component {
    componentDidMount() {
        // 在组件挂载时调用 initialSession 来初始化会话
        initialSession();
    }
    render() {
        return (
        <div class="row">
            <div class="col-4"></div>
            <div class="col-4">
                <div className="d-flex justify-content-center align-items-center"  style={{ height: '80vh' }}>
                    <LoginForm />
                </div>
            </div>
            <div class="col-4"></div>
          </div>
        ); 
    }
}

class LoginForm extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            employeeID:'',
            password: '',
            errors: '',
            account: '',
        };
    }
    
    alertErrors = () => {
        if (this.state.errors) {
            window.alert(this.state.errors);
        }
    }

    // 将用户名以及后端响应的token（Name,Password)存储在本地
    userdata = (data) => {
        setLocalStorage('session', data, true);
    }

    onsubmit = (e) => {
        e.preventDefault();
        LoginApi.login({
            employeeID:Number( this.state.employeeID),
            // name: this.state.name,
            password: this.state.password,
        })
        .then(res => {
            console.log("登录返回数据", res);
            this.userdata(res.user); 
        })
        .catch(error => {
            console.log("请求错误", error);

            // 检查返回的错误信息
            if (error.response && error.response.data) {
                this.setState({ 
                    errors: error.response.data.errormessage
                }, () => {
                    this.alertErrors();
                    console.log("错误信息 this.state.errors:", this.state.errors);
                });
            }
        });
    }

    registerHandle = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        const { name, password,employeeID } = this.state;
        return (
            <div style={{width: '80%'}}>
                <h3 className="text-center">顶呱呱收银系统</h3>
                <form onSubmit={this.onsubmit}>
                    <div className="mb-3">
                        <label htmlFor="employeeID" className="form-label">账号：</label>
                        <input
                            type="text"
                            className="form-control"
                            id="employeeID"
                            name="employeeID"
                            value={employeeID}
                            placeholder="请输入注册账号"
                            onChange={this.registerHandle}
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
                            onChange={this.registerHandle}
                        />
                    </div> 
                    <button type="submit" className="btn btn-primary btn-lg btn-block">登录</button>
            </form> 
            </div> 
                  
        );
    }
}
