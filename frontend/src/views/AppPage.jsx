import HeaderNav from '../utils/HeaderNav';
import React from 'react';
import { getLocalStorage } from '../components/localstorage';

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

export default function AppPage() {
    const name = getLocalStorage('session', true).name;
    return (
        <>
            {name === '' && <HeaderNav />}
            <div className="container-fluid" style={{ minHeight: '100vh', padding: '20px', position: 'relative' }}>
                {/* 背景元素 */}
                <div className="background" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url('http://localhost:3001/images/3000page.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.7
                }}></div>
                {/* 内容元素 */}
                <div className="content" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="text-left mb-4" style={{
                        backgroundColor:'71a560',
                        height: '80px',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        margin: '0 auto',
                        padding: '0 20px',
                        borderRadius: '5px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                        <p style={{fontFamily:'monospace',fontSize: '2.2em', color: 'black', margin: 0 }}>欢迎来到顶呱呱收银系统!</p>
                    </div>
                    <div className="image-container mb-4 text-center">
                        <img src="http://localhost:3001/images/sologan.png" alt="sologan " style={{ 
                            maxWidth: '70%', 
                            maxHeight: '50%',
                            opacity: 0.6,
                            border: '5px solid transparent', // 设置透明边框
                            borderRadius: '10px' // 可选：添加圆角
                        }} />
                    </div>
                    <div className="actions d-flex justify-content-center gap-3">
                        <a href="/login" style={buttonStyle}>登录</a>
                        <a href="/register" style={buttonStyle}>注册</a>
                    </div>
                </div>
            </div>
        </>
    );
}
    