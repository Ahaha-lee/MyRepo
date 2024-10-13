import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Modal from 'react-modal'; // 确保导入 Modal

// 设置应用程序元素
Modal.setAppElement('#root'); // 假设你的根元素的 ID 是 'root'

// 创建根元素并渲染应用程序
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 如果需要，可以保留 reportWebVitals
reportWebVitals();
