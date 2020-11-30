var express = require('express');
const JwtUtil = require('../utils/jwt')
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log('get', req.query, req.headers)
    res.json({
        code: 0,
        data: {
            value: 'test'
        }
    })
});
router.post('/login', function(req, res, next) {
    console.log('post', req.body)

    let username = req.body.username
    let jwt = new JwtUtil({ username: username })
    let token = jwt.generateToken()
    res.json({
        code: 0,
        data: {
            token: token
        }
    })
});
router.post('/test', function(req, res, next) {
    let token = req.headers.authorization
    let jwt = new JwtUtil(token);
    let result = jwt.verifyToken();
    if (result == "err") {
        res.send({ code: 401, msg: "身份验证失败,请重新登录" });
    } else {
        console.log(result.username)
        res.json({
            code: 0,
            data: {
                value: req.body
            }
        })
    }
});
module.exports = router;