import { Component, useState } from "react";
import { LoginApi } from "../../api/login";
import { setLocalStorage } from "../../components/localstorage";
import { initialSession } from "../../components/initial/ini_login";
import { useNavigate } from "react-router-dom";
import { Color } from "antd/es/color-picker";

export class LoginPage extends Component {
    componentDidMount() {
        // 在组件挂载时调用 initialSession 来初始化会话
        initialSession();
    }
    render() {
        return (
            <div className="row" style={{
                minHeight: '100vh',
                position: 'relative',
                backgroundImage: `url('http://localhost:3001/images/3000page.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.7
            }}>
                <div className="col-4"></div>
                <div className="col-4">
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
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
            if (res.user.name === "Tom") {
                navigate("/admin");
            } else if (res.user.name === "Jerry") {
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
        <div className="bg-white p-5 rounded shadow-lg mx-auto my-5" style={{ width: '400px' }}>
            <h3 className="text-center mb-4" style={{ color: 'black', fontSize: '24px' }}>顶呱呱收银系统</h3>
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
                <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-primary btn-lg">登录</button>
                    <button type="button" className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>注册</button>
                </div>
            </form>
        </div>
    );
}