const admin = require('../model/admin.mysql.js');
const resultData = require('../config');
const md5 = require('md5')
const token = require('../utils/token.js')
const time = require('../utils/index.js')
const mall = require('../utils/nodemall.js')

//登录
const fn_signin = async (ctx, next) => {
    let req = ctx.request.body;
    if (!req.account) {
        ctx.body = resultData.abnormal({ msg: '账号不能为空！' });
        return;
    }
    if (!req.password) {
        ctx.body = resultData.abnormal({ msg: '密码不能为空！' });
        return;
    }
    await admin.findDataByAcc({ account: req.account.trim(), password: md5(req.password + resultData.adminKey) }).then(async result => {
        if (result.length == 0) {
            ctx.body = resultData.abnormal({ msg: '账号或密码错误！' });
        } else {
            let Token = token.encryption(req.account);
            await admin.writeToken([Token, result[0].id]).then(res => {
                result[0].token = Token;
                delete result[0].password;
                ctx.body = resultData.success({ data: result[0], msg: '登录成功！' });
            })
        }
    })
}
//获取会员信息
const fn_info = async (ctx, next) => {
    let req = ctx.request.body;
    await admin.findDataByToken(req.token).then(async (result) => {
        if (result.length == 0) {
            ctx.body = resultData.tokenFail({ msg: '该账户不存在！' });
        } else {
            delete result[0].password;
            ctx.body = resultData.success({ data: result[0]});
        }
    })
}
//获取用户列表
const fn_getuser = async (ctx, next) => {
    let req = ctx.request.body;
    await admin.userList([req.pageNum, req.pageSize, req.search]).then(async result => {
        let count = result[1][0] ? result[1][0].count : 0;
        ctx.body = resultData.success({ data: { pageNum: req.pageNum, pageSize: req.pageSize, count: count, list: result[0], }, msg: '获取成功' });
    })
}
//获取申请试用列表
const fn_gettry = async (ctx, next) => {
    let req = ctx.request.body;
    await admin.tryList(req).then(async result => {
        let count = result[1][0] ? result[1][0].count : 0;
        ctx.body = resultData.success({ data: { pageNum: req.pageNum, pageSize: req.pageSize, count: count, list: result[0], }, msg: '获取成功' });
    })
}
//审核(1:通过,2:拒绝)
const fn_tryexamine = async (ctx, next) => {
    let req = ctx.request.body;
    await admin.findTry(req).then(async result => {
        if (result[0].length > 0) {
            if (result[0].closeStatus == 0) {
                ctx.body = resultData.abnormal({ msg: '该账户已关闭！' });
            } else {
                if (result[1].length > 0) {
                    if (result[1][0].examineStatus != 0) {
                        ctx.body = resultData.abnormal({ msg: '该状态不能修改！' });
                        return;
                    } else {
                        let nowTime = time.getNowTime();
                        await admin.tryPass([req.status, nowTime, req.id]).then( async result1 => {
                            //审核通过后发送邮件
                            if(req.status == 1){
                                await mall.sendmail(result[1][0].userEmail)
                            }
                            ctx.body = resultData.success({ msg: '审核成功' });
                        })
                    }
                } else {
                    ctx.body = resultData.abnormal({ msg: '该记录不存在！' });
                }
            }
        } else {
            ctx.body = resultData.tokenFail({ msg: '身份验证失败，请重新登录！' });
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
    'POST /admin/signin': fn_signin,
    'POST /admin/info': fn_info,
    'POST /admin/user/list': fn_getuser,
    'POST /admin/try/list': fn_gettry,
    'POST /admin/try/examine': fn_tryexamine,
};
