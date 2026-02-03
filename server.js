// 局域网聊天服务器
// 使用Node.js和Socket.io

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

// 创建Express应用
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// 静态文件服务
app.use(express.static(path.join(__dirname)));

// 在线用户列表
let onlineUsers = [];

// 监听连接事件
io.on('connection', (socket) => {
    console.log('新用户连接:', socket.id);
    
    // 加入聊天室
    socket.on('join', (username) => {
        // 添加到在线用户列表
        onlineUsers.push({
            id: socket.id,
            name: username,
            status: 'online'
        });
        
        // 广播用户加入消息
        io.emit('userJoined', {
            user: username,
            onlineUsers: onlineUsers.map(user => ({ id: user.id, name: user.name, status: user.status }))
        });
        
        // 发送欢迎消息
        socket.emit('message', {
            id: Date.now(),
            sender: '系统',
            content: `欢迎 ${username} 加入聊天室！`,
            type: 'system',
            time: new Date().toLocaleTimeString()
        });
        
        // 广播给其他用户
        socket.broadcast.emit('message', {
            id: Date.now(),
            sender: '系统',
            content: `${username} 加入了聊天室`,
            type: 'system',
            time: new Date().toLocaleTimeString()
        });
    });
    
    // 接收消息
    socket.on('sendMessage', (message) => {
        // 广播消息给所有用户
        io.emit('message', {
            id: Date.now(),
            sender: message.sender,
            content: message.content,
            type: 'other',
            time: new Date().toLocaleTimeString()
        });
    });
    
    // 断开连接
    socket.on('disconnect', () => {
        // 从在线用户列表中移除
        const userIndex = onlineUsers.findIndex(user => user.id === socket.id);
        if (userIndex !== -1) {
            const username = onlineUsers[userIndex].name;
            onlineUsers.splice(userIndex, 1);
            
            // 广播用户离开消息
            io.emit('userLeft', {
                user: username,
                onlineUsers: onlineUsers.map(user => ({ id: user.id, name: user.name, status: user.status }))
            });
            
            // 广播给其他用户
            io.emit('message', {
                id: Date.now(),
                sender: '系统',
                content: `${username} 离开了聊天室`,
                type: 'system',
                time: new Date().toLocaleTimeString()
            });
        }
        
        console.log('用户断开连接:', socket.id);
    });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`局域网访问地址: http://${getLocalIP()}:${PORT}`);
});

// 获取本地IP地址
function getLocalIP() {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    
    for (const iface in interfaces) {
        const addresses = interfaces[iface];
        for (const addr of addresses) {
            if (addr.family === 'IPv4' && !addr.internal) {
                return addr.address;
            }
        }
    }
    return '127.0.0.1';
}

console.log('局域网聊天服务器已启动');
console.log('请确保所有设备都连接到同一局域网');
console.log('然后在浏览器中访问服务器地址');
