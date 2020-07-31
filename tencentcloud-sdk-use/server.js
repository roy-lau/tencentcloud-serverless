const http = require('http');
const app = require('./app');

const SERVER = http.createServer(app.callback());
const PORT = process.env.PORT || 3000;
console.log(process.env)
// 优雅地关闭 DB 连接
const gracefulShutdown = () => {
    console.error('Shutting down...');
};

// Server start
SERVER.listen(PORT, '0.0.0.0', () => {
    console.info(`\n\thttp://localhost:${PORT}`);

    // 处理kill命令
    process.on('SIGTERM', gracefulShutdown);

    // 服务器崩溃
    process.on('uncaughtException', gracefulShutdown);
});
