var test = require('../model/mysql.js');
var resultData = require('./controllers.config.js');
//增加
var fn_add = async (ctx, next) => {
    await test.addData().then(result => {
        if (result.insertId > 0) {
            ctx.body = resultData.success({msg:'添加成功'});
        } else {
            ctx.body = resultData.abnormal({msg:'添加失败'});
        }
    });
};
//删除
var fn_delete = async (ctx, next) => {
    await test.deleteData().then(result => {
        if (result.affectedRows > 0) {
            ctx.body = resultData.success({msg:'删除成功'});
        } else {
            ctx.body = resultData.abnormal({msg:'删除失败'});
        }
    });
};

//修改
var fn_updata = async (ctx, next) => {
    await test.updataData().then(result => {
        if (result.affectedRows > 0) {
            ctx.body = resultData.success({msg:'修改成功'});
        } else {
            ctx.body = resultData.success({msg:'数据不存在,修改失败!'});
        }
    });
};



//查询
var fn_query = async (ctx, next) => {
    await test.getData().then(result => {
        ctx.body = resultData.success({data:result});
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
