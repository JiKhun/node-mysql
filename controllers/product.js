const product = require('../model/mysql.js');
const resultData = require('./controllers.config.js');
const time = require('../utils/index.js')

//申请试用
const fn_tryout = async (ctx, next) => {
    let req = ctx.request.body;
    if (!req.productId) {
        ctx.body = resultData.abnormal({ msg: '请选择试用产品！' });
        return;
    }
    if (!req.token) {
        ctx.body = resultData.abnormal({ msg: '请登录！' });
        return;
    }
    await product.findDataByToken(req.token).then(async (result) => {
        if (result == 0) {
            ctx.body = resultData.abnormal({ msg: '用户不存在！' });
        } else {
            let users = result[0];
            await product.findUserIsTryout([users.id, req.productId]).then(async (result1) => {
                if (result1.length == 0) {
                    await product.findDataByProduct(req.productId).then(async (result1) => {
                        if (result.length == 0) {
                            ctx.body = resultData.abnormal({ msg: '该商品不存在！' });
                        } else {
                            let users = result[0],
                                products = result1[0],
                                nowTime = time.getNowTime();
                            let params = [products.id, nowTime, users.id, products.name, products.describe];
                            await product.addUserTryOut(params).then((res) => {
                                ctx.body = resultData.success({ msg: '申请成功，请等待审核！' });
                            })
                        }
                    })
                } else {
                    ctx.body = resultData.abnormal({ msg: '正在试用中，不要重复申请！' });
                }
            })
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
    'POST /web/user/tryout': fn_tryout
};
