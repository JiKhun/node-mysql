const user = require('../model/mysql.js');
const resultData = require('./controllers.config.js');
const time = require('../utils/index.js')
const md5 = require('md5')
const token = require('../utils/token.js')

//注册
const fn_signup = async (ctx, next) => {
    let req = ctx.request.body;
    if (!req.tel) {
        ctx.body = resultData.abnormal({ msg: '手机号不能为空！' });
        return;
    }
    if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(req.tel.trim())) {
        ctx.body = resultData.abnormal({ msg: '手机号格式错误！' });
        return;
    }
    if (!req.email) {
        ctx.body = resultData.abnormal({ msg: '邮箱不能为空！' });
        return;
    }
    if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(req.email.trim())) {
        ctx.body = resultData.abnormal({ msg: '邮箱格式错误！' });
        return;
    }
    if (req.password.length < 6 || req.password.length > 20) {
        ctx.body = resultData.abnormal({ msg: '密码至少大于等于6位，小于等于20位！' });
        return;
    }
    if (!req.company) {
        ctx.body = resultData.abnormal({ msg: '公司不能为空！' });
        return;
    }
    if (!req.job) {
        ctx.body = resultData.abnormal({ msg: '职位不能为空！' });
        return;
    }
    await user.findDataByTel(req.tel.trim()).then(async result => {
        if (result.length > 0) {
            ctx.body = resultData.abnormal({ msg: '该账户已存在，请登录！' });
        } else {
            let nowTime = time.getNowTime();
            let Token = token.encryption(req.tel);
            let params = [req.name.trim(), req.tel.trim(), req.company.trim(), req.email.trim(), md5(req.password + resultData.key), req.job.trim(), nowTime, Token];
            await user.userRegister(params).then(async result => {
                ctx.body = resultData.success({ data: { token: Token }, msg: '注册成功' });
            });
        }
    })
}
//登录
const fn_signin = async (ctx, next) => {
    let req = ctx.request.body;
    if (!req.tel) {
        ctx.body = resultData.abnormal({ msg: '手机号不能为空！' });
        return;
    }
    if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(req.tel.trim())) {
        ctx.body = resultData.abnormal({ msg: '手机号格式错误！' });
        return;
    }
    if (!req.password) {
        ctx.body = resultData.abnormal({ msg: '密码不能为空！' });
        return;
    }
    await user.findDataByTel(req.tel.trim()).then(async result => {
        if (result.length == 0) {
            ctx.body = resultData.abnormal({ msg: '该用户不存在！' });
        } else {
            if (result[0].password === md5(req.password + resultData.key)) {
                let Token = token.encryption(req.tel);
                await user.writeToken([Token, result[0].id]).then(res => {
                    result[0].token = Token;
                    ctx.body = resultData.success({ data: result[0], msg: '登录成功！' });
                })
            } else if (result[0].password !== md5(req.password + resultData.key)) {
                ctx.body = resultData.abnormal({ msg: '密码错误！' });
            }
        }
    })
}
//获取会员信息
const fn_info = async (ctx, next) => {
    let req = ctx.request.body;
    await user.findDataByToken(req.token).then(async (result1) => {
        if (result.length == 0) {
            ctx.body = resultData.abnormal({ msg: '该会员不存在！' });
        } else {
            ctx.body = resultData.success({ data: result[0]});
        }
    })
}
/*
    GET获取
    POST行为处理器
    DELETE删除
    PUT替换
    PATCH更新
*/
module.exports = {
    'POST /web/user/signup': fn_signup,
    'POST /web/user/signin': fn_signin,
    'GET /web/user/info': fn_info,
};
