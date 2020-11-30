var express = require('express');
var router = express.Router();
const axios = require('axios')
const md5 = require('js-md5')
axios.defaults.baseURL = 'https://app.myyancheng.com.cn/api/auth'

function makeRandomSeries() {
    let t = ""
    for (let i = 0; i < 10; i += 1) {
        t += Math.floor(Math.random() * 10)
    }
    if (t.startsWith("0")) {
        t.replace("0", "1")
    }
    return t
}
const appId = '085e43ab837f47058a5e1cb028698f44' // 请替换成你自己的appId
const appKey = 'c71c6583b5a64a6895e5d6125a297dc4' // 请替换成你自己的appKey
const timestamp = +new Date()
const randomSeries = makeRandomSeries()
const cipherText = makeCipherText()

function makeCipherText() {
    return md5(
        `appId${appId}appKey${appKey}randomSeries${randomSeries}timestamp${timestamp}`
    )
}
router.get('/getInitCode', async(req, res) => {
    try {
        const response = await axios.post('/openPlatform/initCode/getInitCode.do', {
            appId, // 第三方服务在开放平台申请的 appId
            timestamp, // 时间戳（长度为为 10 位或 13 位的时间戳）
            randomSeries, // 随机序列（长度为 10 位的数字序列）
            cipherText // 密文，参考文档进行md5加密
        })
        res.send(response.data)
    } catch (error) {
        res.send({ code: error.response.status, msg: error.response.data })
    }
})

module.exports = router;