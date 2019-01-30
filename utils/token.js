let jwt = require('jsonwebtoken');

let secretOrPrivateKey = "CHUANGLIAN" // 这是加密的key（密钥）
//生成token 
exports.encryption = (name) => {
    let content = { name }; // 要生成token的主题信息
    let token = jwt.sign(content, secretOrPrivateKey, {
        expiresIn: '30day'  // 1星期过期
    });
    return token;
}
//验证token
exports.decrypt = (token) => {
    let status = jwt.verify(token, secretOrPrivateKey, function (err, decode) {
        if(err){
            return false
        }else{
            return true
        }
    })
    return status;
}