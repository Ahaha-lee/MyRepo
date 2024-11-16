const path = require('path');

module.exports = function override(config, env) {
    // 仅在开发环境中修改 devServer 配置
    if (env === 'development') {
        config.devServer = {
            ...config.devServer,
            static: './dist', // 提供静态文件
            hot: true, // 启用热模块替换
            allowedHosts: 'all', // 允许所有主机
        };
    }

    // 修改输出路径
    config.output = {
        ...config.output,
        path: path.resolve(__dirname, 'dist'), // 输出路径
        clean: true, // 清理输出目录
    };

    // 添加模块规则
    config.module.rules.push(
        {
            test: /\.jsx?$/, // 处理 JavaScript 和 JSX 文件
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader', // 使用 Babel 转换 ES6+
                options: {
                    presets: [
                        '@babel/preset-env',   // 支持 ES6+
                        '@babel/preset-react'  // 支持 JSX
                    ]
                }
            },
        },
        {
            test: /\.d\.ts$/, // 匹配 .d.ts 文件
            use: 'ignore-loader', // 使用 ignore-loader 忽略这些文件
            exclude: /node_modules/,
        },
        
        {
            test: /\.css$/, // 处理 CSS 文件
            use: ['style-loader', 'css-loader'], // 使用 style-loader 和 css-loader
        },
        {
            test: /\.(png|jpg|gif|svg)$/, // 处理图片文件
            type: 'asset/resource',
        },
        {
            test: /\.tsx?$/, // 匹配 .ts 和 .tsx 文件
            use: 'ts-loader',
            exclude: /node_modules/,
        },
    );

    // 添加 resolve.fallback 配置
    config.resolve.fallback = {
        "zlib": require.resolve("browserify-zlib"),
        "querystring": require.resolve("querystring-es3"),
        "path": require.resolve("path-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "http": require.resolve("stream-http"),
        "fs": false, // 如果不需要 fs 模块，可以设置为 false
        "net": false, // 添加 net 模块的 fallback
        "tls": false, // 添加 tls 模块的 fallback
        "process": require.resolve("process/browser"), // 添加 process 的 fallback
        "constants": require.resolve("constants-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "https": require.resolve("https-browserify"),
        "vm": require.resolve("vm-browserify"),
        "child_process": false, // 如果不需要，可以设置为 false
        "worker_threads": false, // 如果不需要，可以设置为 false  
        "tty": require.resolve("tty-browserify"),
        "module": false, // 如果不需要，可以设置为 false
    };

    // 添加 source map 配置
    config.devtool = 'source-map'; // 生成 source map

    return config; // 返回修改后的配置
};
