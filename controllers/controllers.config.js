//配置返回对象默认参数
let rerutnData = {
    data: null,//返回数据
    returnCode: '200',//返回代码
    msg: ''//返回信息
};
//md5加密添加的key值
exports.key = 'CL-OFFICIAL';

//成功返回对象方法
exports.success = ({ data = null, msg = '' }) => {
    rerutnData.data = data;
    rerutnData.msg = msg;
    rerutnData.returnCode = '200';
    return rerutnData;
}
//失败操作
exports.abnormal = ({ data = null, msg = '' }) => {
    rerutnData.data = data;
    rerutnData.msg = msg;
    rerutnData.returnCode = '0011';
    return rerutnData;
}
//用户信息验证失败
exports.tokenFail = ({ data = null, msg = '' }) => {
    rerutnData.data = data;
    rerutnData.msg = msg;
    rerutnData.returnCode = '0014';
    return rerutnData;
}