const {online, outline} = require('../db-helper/helper');
const {verifyToken} = require('../middleware/verify-token');
const {USER_SECRET} = require('../config/token-secret');
const {findKey} = require('lodash');

function loginExpire(socket) {
    socket.emit('loginExpire');
}

function error(socket, msg) {
    socket.emit('error', msg);
}


function createIO(http) {
    const io = require('socket.io')(http);
    const hashName = {};
    const onLineUser = {};
    io.on('connection', function (socket) {
        try {
            socket.on('disconnect', function () {

                let userName = findKey(hashName, function (o) {
                    return o === socket.id
                });

                Reflect.deleteProperty(hashName, userName);

                outline(userName).then(() => {

                    socket.broadcast.emit('getUserStatus');

                }).catch(err => {
                    console.log('下线失败', err);
                });

            });

            // 用户登录后，跳转到 game 页面，自动建立 websocket 连接，成功后，传递 userInfo ，验证 token，
            socket.on('userInfo', function (data) {
                const token = data.userName;

                verifyToken(token, USER_SECRET, function (payload) {

                    let userInfo = payload._doc;

                    hashName[userInfo.userName] = socket.id;

                    online(userInfo.userName).then(() => {
                        // 给除自己以外的所有人推送消息
                        socket.broadcast.emit('getUserStatus');
                        // 给自己推送消息
                        socket.emit('getUserStatus');

                    }).catch(e => {

                        error(socket, '上线失败');

                    })

                }, function (e) {

                    loginExpire(socket);
                });
            });
            // 落子
            socket.on('placingPieces', function (data, to) {
                let toId = hashName[to];
                io.sockets.sockets[toId].emit('acceptPieces', data);
            });
            // 发起挑战
            socket.on('launchTo', function (from, to) {
                const id = hashName[to];
                io.sockets.sockets[id].emit('launchFrom', from);
            });
            // 接受挑战
            socket.on('acceptLaunch', function (isAccept, from, to) {
                const id = hashName[to];
                io.sockets.sockets[id].emit('get launch info', isAccept, from);
            })
        } catch (e) {
            console.log('socket error', e);
        }




    });
}


module.exports = createIO;













