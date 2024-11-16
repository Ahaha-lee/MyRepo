import { Component } from "react";
import { LoginApi } from "../../api/login";
import { setLocalStorage } from "../../utils/localstorage";
import { initialSession } from "../../utils/initialLocal/ini_login";

export class LoginPage extends Component {
    componentDidMount() {
        // 在组件挂载时调用 initialSession 来初始化会话
        initialSession();
    }
    render() {
        return (
            <div>
                <div className="text-center">
                    <h3>顶呱呱收银系统</h3>
                </div>
                <div className="row g-0">
                    <div className="col-4"></div>
                    <div className="col-4">
                        <LoginForm />
                    </div>
                    <div className="col-4"></div>
                </div>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            password: '',
            errors:'',
            account:'',
        };
    }
    alertErrors=()=>{
        if(this.state.errors){
            window.alert(this.state.errors);
        }
    }

    // 将用户名以及后端响应的token（Name,Password)存储在本地
    userdata = (data) => {
      setLocalStorage('session',data, true)
    }
    onsubmit = (e) => {
        e.preventDefault();
        LoginApi.login({
            name: this.state.name,
            password: this.state.password,
        })
        .then(res => {
             console.log("登录返回数据",res)
             this.userdata(res.user); 
        })
        .catch(error => {
            console.log("请求错误",error)

        // 检查返回的错误信息
        if (error.response && error.response.data) {
        this.setState({ 
            errors: error.response.data.errormessage
        }, () => {
            this.alertErrors();
            console.log("错误信息 this.state.errors:", this.state.errors);
        });
    }
        })
    }

    registerHandle = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        const { name, password } = this.state;
        return (
            <div>
                <form onSubmit={this.onsubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">账号：</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={name}
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
                <button type="submit" className="btn btn-primary">登录</button>
                </form>
            </div> 
            );
}
}


