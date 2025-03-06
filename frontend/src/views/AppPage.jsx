import HeaderNav from '../utils/HeaderNav';
import React from 'react';
import { getLocalStorage } from '../components/localstorage';


export default function AppPage() {
    const name = getLocalStorage('session', true).name;
    return (
        <>
            {name === '' && <HeaderNav />}
            <div className="container-fluid" style={{ backgroundColor: '#e0f7da', minHeight: '100vh' }}>
                <div className="text-left mb-4" style={{
                    backgroundColor: 'white',
                    height: '50px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    margin: '0 auto',
                    padding: '0 20px',
                    borderRadius: '5px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>

                    <p style={{ fontSize: '1.2em', color: 'black', margin: 0 }}>欢迎来到顶呱呱收银系统</p>
                </div>
                <div className="actions d-flex justify-content-center gap-3">
                    <a href="/login" style={buttonStyle}>登录</a>
                    <a href="/register" style={buttonStyle}>注册</a>
                </div>
            </div>
        </>
    );
}

const buttonStyle = {
    padding: '10px 20px',
    fontSize: '1em',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
    display: 'inline-block',
    textAlign: 'center'
};

buttonStyle[':hover'] = {
    backgroundColor: '#0056b3'
};