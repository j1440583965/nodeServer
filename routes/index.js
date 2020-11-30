var express = require('express');
var querySql = require('../db/db')
var multiparty = require("multiparty");
var fs = require("fs");
var { resolve } = require('path')
var router = express.Router();
var app = require('../app')

/* GET home page. */
router.get('/', function(req, res, next) {

    querySql('SELECT * FROM USER', result => {
            console.log(result)
            res.json({
                code: 0,
                data: {
                    test: ';',
                    isChinese: ''
                }
            })
        })
        // res.render('index', { title: 'Express' });
});
//图片加载,存储在public/images下的所有图片
router.get('/public/images/*', function(req, res) {
    console.log(resolve(__dirname, '../'))

    res.sendFile(resolve(__dirname, '../') + "/" + req.url);
    console.log("Request for " + req.url + " received.");
})
router.post('/saveMsg', function(req, res, next) {
    console.log(req.body)
    let sqlStr = "UPDATE msg SET msg = '" + req.body.msg + "' WHERE id = 1"
    querySql(sqlStr, result => {
        res.json({ code: 0, data: '保存成功！' })
    }, err => {
        res.json({ code: 1, msg: '保存失败！' })
    })
});
router.get('/findMsg', function(req, res, next) {
    // console.log(req.query.id)
    let sqlStr = "SELECT msg FROM msg WHERE id = " + req.query.id
    querySql(sqlStr, result => {
        console.log(result[0].msg)
        res.json({ code: 0, data: result[0].msg })
    }, err => {
        res.json({ code: 1, msg: '查询失败！' })
    })
});
router.post('/test/regist', function(req, res, next) {
    console.log(req.body)
    let sqlStr = "INSERT INTO `USER` VALUES('" + req.body.username + "','" + req.body.password + "',0)"
    console.log(sqlStr)
        // let sqlStr = 'SELECT * FROM USER'
    querySql(sqlStr, result => {
        res.json({ code: 0, data: '注册成功！' })
    }, err => {
        if (err.code === 'ER_DUP_ENTRY') {
            res.json({ code: 1, msg: '用户名已存在！' })
        } else {
            res.json({ code: 1, msg: err })
        }
    })
});

router.post('/upload', function(req, res, next) {
    //生成multiparty对象，并配置上传目标路径
    var uploadDir = './public/images'
    var form = new multiparty.Form({ uploadDir: uploadDir });
    form.parse(req, function(err, fields, files) {
        console.log(files.file[0], ' fields2')
        if (err) {
            res.json({ code: 1, msg: '上传失败' })
        } else {
            var imgType = files.file[0].originalFilename.split('.')[1]
            var t = new Date().getTime();
            let newName = t + '.' + imgType
            console.log(newName)
            fs.renameSync(files.file[0].path, './public/images/' + newName);
            files.file[0].originalFilename = newName
            res.json({ code: 0, data: files })
        }
    });
});

module.exports = router;