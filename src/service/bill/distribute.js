const {
    login,
    register,
    findUsers,
    findAllUser,
} = require('../../db-helper/helper');

function handleLogin(data) {
    return new Promise((resolve, reject) => {

        login(data).then(data => {

            resolve(data);

        }).catch(err => {
            reject(err)
        })
    });
}

function handleRegister(data) {
    return new Promise((resolve, reject) => {

        register(data).then(data => {

            resolve(data);

        }).catch(err => {
            reject(err)
        })
    });
}

// 获取所有 userList
function getALLUserList() {

    return new Promise((resolve, reject) => {

        findAllUser().then(data => {

            let result = data.data.map(item => {
                return {
                    userName: item.userName,
                    nickname: item.nickname,
                    level: item.level,
                    online: item.online
                }
            });

            resolve(result);

        }).catch(err => {

            reject(err)

        })
    });
}

// 获取在/离线用户
function getOnlineUserList(data) {

    return new Promise((resolve, reject) => {

        findUsers(data).then(data => {

            let result = data.data.map(item => {
                return {
                    userName: item.userName,
                    nickname: item.nickname,
                    level: item.level,
                    online: item.online
                }
            });

            resolve(result);

        }).catch(err => {
            reject(err)
        })
    });
}


module.exports = {
    handleLogin,
    handleRegister,
    getALLUserList,
    getOnlineUserList,
}
