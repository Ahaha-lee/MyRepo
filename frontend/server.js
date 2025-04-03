const express = require('express');
const path = require('path');

const app = express();
const port = 3001; // 确保端口与前端不冲突

// 设置静态文件目录
app.use('/images', express.static(path.join(__dirname, 'images')));

// 测试根路径
app.get('/', (req, res) => {
    res.send('Hello World!'); // 测试根路径
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
