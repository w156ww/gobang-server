const {User} = require('./model/index');
const {responseStatus} = require('./response-status');
const jwt = require('jsonwebtoken');
const {USER_SECRET} = require('../config/token-secret');


function setOnline(user, val) {
    user.online = val;
    return new Promise((resolve, reject) => {
        user.save(function (err, updateUser) {

            if (err) {
                reject(err)
            } else {
                resolve();
            }
        })
    })

}

// 登录
function login(req) {

    const {userName} = req;

    return new Promise((resolve, reject) => {

        User.findOne({userName}, function (err, user) {

            if (err) return reject(err);

            if (!user) {

                resolve(responseStatus.loginFail);
            } else {

                setOnline(user, true).then(() => {

                    let userInfo = {
                        ...user
                    };

                    responseStatus.loginSuccess.TOKEN = jwt.sign(userInfo, USER_SECRET, {
                        expiresIn: "1h"
                    });

                    resolve(responseStatus.loginSuccess);
                }).catch(err => {
                    console.log('err::', err);
                    reject(err)

                })
            }

        })
    })
}

// 注册
function register(req, res) {

    const {userName, nickname} = req;

    return new Promise((resolve, reject) => {

        User.findOne({userName}, function (err, user) {

            if (err) return reject(err);


            if (user) {

                resolve(responseStatus.registered);

            } else {

                User.create({
                    userName,
                    nickname
                }).then(result => {

                    resolve(responseStatus.registerSuccess);

                }).catch(err => {

                    resolve(responseStatus.registerFail);
                })
            }
        })
    })
}

// 查找在/离线用户
function findUsers(req) {
    const {online} = req;
    return new Promise((resolve, reject) => {
        User.find({online}, function (err, users) {
            if (err) {
                reject({
                    msg: '获取失败，请重试',
                    data: null
                })
            } else {
                resolve({
                    data: users
                });
            }
        })
    })
}

// 查找所有用户
function findAllUser() {
    return new Promise((resolve, reject) => {
        User.find(function (err, users) {
            if (err) {
                reject({
                    msg: '获取失败，请重试',
                    data: null
                })
            } else {

                resolve({
                    data: users
                });
            }
        })
    })
}

// 根据 userName 查找指定用户
function findUserByUserName(userName) {
    return new Promise((resolve, reject) => {
        User.findOne({userName}, (err, user) => {
            if (err) return reject(err);
            if (user) {
                resolve(user);
            } else {
                reject('未找到');
            }
        })
    })
}

// 上线
function online(userName) {
    return new Promise((resolve, reject) => {
        User.updateOne({userName}, {online: true}, function (err, updateUser) {
            if (err) return reject(err);
            if (updateUser) {
                resolve()
            }
        })
    })
}

// 下线
function outline(userName) {
    return new Promise((resolve, reject) => {
        User.updateOne({userName}, {online: false}, function (err, updateUser) {
            if (err) return reject(err);
            if (updateUser) {
                resolve()
            }
        })
    })
}

module.exports = {
    login,
    register,
    findUsers,
    findAllUser,
    findUserByUserName,
    online,
    outline,
};




