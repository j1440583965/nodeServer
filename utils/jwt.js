// 引入模块依赖
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
// 创建 token 类

// 参考  https://blog.csdn.net/pandoraqjk/article/details/106408552?utm_medium=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.channel_param&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.channel_param
class Jwt {
    constructor(data) { //data token生成需要传入的key值 可作为唯一标识的值
        this.data = data;
    }

    //生成token
    generateToken() {
        let data = this.data;
        let created = Math.floor(Date.now() / 1000);

        let cert = fs.readFileSync(path.join(__dirname, "../pem/jwt.pem")); //私钥 可以自己生成
        //  created + 60 * 60 // 过期时间1小时
        let token = jwt.sign({
                data,
                exp: created + 60 // 过期1分钟
            },
            cert, { algorithm: "RS256" }
        );
        return token;
    }

    // 校验token
    verifyToken() {
        let token = this.data;
        let cert = fs.readFileSync(path.join(__dirname, "../pem/jwt_pub.pem")); //公钥 可以自己生成
        let res;
        try {
            let result = jwt.verify(token, cert, { algorithms: ["RS256"] }) || {};
            let { exp = 0 } = result,
            current = Math.floor(Date.now() / 1000);
            if (current <= exp) {
                res = result.data || {};
            } else {
                res = "err";
            }
        } catch (e) {
            res = "err";
        }
        return res;
    }
}
module.exports = Jwt;