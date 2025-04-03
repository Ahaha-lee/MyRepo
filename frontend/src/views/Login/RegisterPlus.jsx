import { Component } from "react";
import { RegisterApi } from "../../api/login";
import React from "react";
import { roleApi } from "../../api/system";

export class RegisterPage extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-4">
                    <div className="one">
                    </div>
                </div>
                <div className="col-5">
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                        <RegisterForm />
                    </div>
                </div>
                <div className="col-3"></div>
            </div>
        );
    }
}

class RegisterForm extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            password: '',
            gender: '',
            birthday: '',
            phone: '',
            roleid: '',
            roles: [],
            errors: ''
        };
    }

    componentDidMount() {
        this.getRoleInfo();
    }

    getRoleInfo = async () => {
        try {
            const res = await roleApi.getinfo({
                search_id: 0
            });
            console.log("角色数据返回成功", res);
            this.setState({ roles: res.role });
            console.log("角色数据返回成功", res.role);
        } catch (error) {
            console.log("角色数据返回失败", error);
        }
    };

    alertErrors = () => {
        if (this.state.errors) {
            window.alert(this.state.errors);
        }
    }

    onsubmit = (e) => {
        e.preventDefault();
        const newbirthday = this.state.birthday === ''? null : this.state.birthday;
        RegisterApi.register({
            name: this.state.name,
            password: this.state.password,
            phone: this.state.phone,
            birthday: newbirthday,
            gender: this.state.gender,
            roleid: this.state.roleid
        })
           .then(res => {
                if(res.message
                    == '用户注册成功' ){
                    window.alert("注册成功");
                    window.location.href = "/login";                   
                }
                console.log("注册返回数据", res);
            })
           .catch(error => {
                console.log("请求错误:", error);
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

    handleRoleChange = (e) => {
        // 更新roleid状态
        this.setState({
            roleid: e.target.value
        });
    }

    render() {
        const { name, password, birthday, phone, roleid, roles } = this.state;
        return (
            <div style={{ width: "100%" }}>
                <h3 className="text-center">顶呱呱收银系统</h3>
                <form onSubmit={this.onsubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">注册账号：</label>
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
                        <label htmlFor="password" className="form-label">注册密码：</label>
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
                    <div className="mb-3">
                        <label htmlFor="gender" className="form-label">性别：</label>
                        <div className="form-check form-check-inline">
                            <input
                                type="radio"
                                className="form-check-input"
                                id="male"
                                name="gender"
                                value={"男"}
                                onChange={this.registerHandle}
                            />
                            <label className="form-check-label" htmlFor="male">
                                男
                            </label>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <input
                                type="radio"
                                id="female"
                                name="gender"
                                value={"女"}
                                onChange={this.registerHandle}
                            />
                            <label className="form-check-label" htmlFor="female">
                                女
                            </label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">手机号码:  </label>
                        <input
                            type="text"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={phone}
                            placeholder="请输入手机号码"
                            onChange={this.registerHandle}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="roleid" className="form-label">角色:  </label>
                        <select
                            className="form-control"
                            id="roleid"
                            name="roleid"
                            value={roleid}
                            onChange={this.handleRoleChange}
                        >
                            {roles.map(role => (
                                <option key={role.RoleId} value={role.RoleId}>
                                    {role.RoleName}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* <div className="mb-3">
                        <label htmlFor="birthday" className="form-label">出生日期:</label>
                        <input
                            type="date"
                            className="form-control"
                            id="birthday"
                            name="birthday"
                            value={birthday}
                            placeholder="请输入出生日期"
                            onChange={this.registerHandle}
                        />
                    </div> */}
                    <button type="submit" className="btn btn-primary">注册</button>
                </form>
            </div>
        );
    }
}