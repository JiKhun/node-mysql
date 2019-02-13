//配置返回对象默认参数
let rerutnData = {
    data: null,//返回数据
    returnCode: '200',//返回代码
    msg: ''//返回信息
};
//配置链接数据库参数
module.exports = {
    HOST: 'localhost',
    PORT: 3306,//端口号
    DATABASE: 'official_website_db',//数据库名
    USER: 'root',//数据库用户名
    PASSWORD: 'admin',//数据库密码
    key : 'CL-OFFICIAL',//md5加密添加的key值
    adminKey:'CL-ADMIN',
    //成功返回对象方法
    success : ({ data = null, msg = '' }) => {
        rerutnData.data = data;
        rerutnData.msg = msg;
        rerutnData.returnCode = '200';
        return rerutnData;
    },
    //失败操作
    abnormal : ({ data = null, msg = '' }) => {
        rerutnData.data = data;
        rerutnData.msg = msg;
        rerutnData.returnCode = '0011';
        return rerutnData;
    },
    //用户信息验证失败
    tokenFail : ({ data = null, msg = '' }) => {
        rerutnData.data = data;
        rerutnData.msg = msg;
        rerutnData.returnCode = '0014';
        return rerutnData;
    }
};