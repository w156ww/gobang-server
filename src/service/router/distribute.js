const {USER_SECRET} = require('../../config/token-secret');
const {verifyToken} = require('../../middleware/verify-token');

const {
    login,
    register,
    findUsers,
    findAllUser,
} = require('../../db-helper/helper');
const {
    getALLUserList,
    getOnlineUserList
} = require('../bill/distribute');

// 请求分发
function reqDistribute(router) {
    // 登录
    router.post("/api/login", function (req, res) {

        const body = req.body;

        login(body).then((data) => {
            res.send(res.getSuccessResult(data))

        }).catch(err => {
            res.send(res.getErrorResult(err.toString()))
        })
    });

    // 注册
    router.post('/api/register', function (req, res) {

        const body = req.body;

        register(body, res).then(data => {
            res.send(res.getSuccessResult(data))

        }).catch(err => {

            res.send(res.getErrorResult(err.toString()))
        })
    });

    // 获取已登录的用户
    router.get('/api/findOnLineUsers', function (req, res) {

        const data = req.query;

        getOnlineUserList(data).then(data => {

            res.send(res.getSuccessResult(data))
        }).catch(err => {
            res.send(res.getErrorResult(err.toString()))
        })
    });

    // 获取所有用户
    router.get('/api/findAllUser', (req, res) => {

        const token = req.headers['user-token'];

        verifyToken(token, USER_SECRET, function () {

            getALLUserList().then(data => {

                res.send(res.getSuccessResult(data))

            }).catch(err => {

                res.send(res.getErrorResult(err))

            })
        }, function (e) {
            res.send({
                code: 603,
                msg: 'token 不存在或者已失效'
            })
        });

    })

}

module.exports = {
    reqDistribute
}
