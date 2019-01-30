const crypto = require('crypto');
//加密
exports.MD5 = (content) =>{
    const key = 'cl-official'
    let newContent = content + key;
    var md5 = crypto.createHash('md5');
    md5.update(newContent);
    return md5.digest('hex');
}