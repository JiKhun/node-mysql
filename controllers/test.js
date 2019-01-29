var test = require('../model/mysql.js');
var resultData = require('./controllers.config.js');
//增加
var fn_add = async (ctx, next) => {
    await test.addData().then(result => {
        if (result.insertId > 0) {
            resultData.msg = '添加成功';
            ctx.body = resultData;
        } else {
            resultData.returnCode = 302;
            resultData.msg = '添加失败';
            ctx.body = resultData;
        }
    });
};
//删除
var fn_delete = async (ctx, next) => {
    await test.deleteData().then(result => {
        if (result.affectedRows > 0) {
            resultData.msg = '删除成功';
            ctx.body = resultData;
        } else {
            resultData.returnCode = 302;
            resultData.msg = '数据不存在,删除失败!';
            ctx.body = resultData;
        }
    });
};

//修改
var fn_updata = async (ctx, next) => {
    await test.updataData().then(result => {
        if (result.affectedRows > 0) {
            resultData.msg = '修改成功';
            ctx.body = resultData;
        } else {
            resultData.returnCode = 302;
            resultData.msg = '数据不存在,修改失败!';
            ctx.body = resultData;
        }
    });
};



//查询
var fn_query = async (ctx, next) => {
    await test.getData().then(result => {
        resultData.data = result;
        ctx.body = resultData;
    });
};
/*
    GET获取
    POST行为处理器
    DELETE删除
    PUT替换
    PATCH更新
*/
module.exports = {
    'GET /query': fn_query,
    'POST /add': fn_add,
    'DELETE /delete': fn_delete,
    'PATCH /updata': fn_updata
};
