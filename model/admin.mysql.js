let mysql = require('mysql');//引入mysql模块
let databaseConfig = require('../config');  //引入数据库配置模块中的数据
let utils = require('../utils/index.js')
const pool = mysql.createPool({
    host: databaseConfig.HOST,
    port: databaseConfig.PORT,
    user: databaseConfig.USER,
    password: databaseConfig.PASSWORD,
    database: databaseConfig.DATABASE,
    multipleStatements: true
});

let query = (sql, value = false) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, value, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}

//查询手机号码是否存在
exports.findDataByAcc = (value) => {
    let addSql = `SELECT * from administrators where account="${value['account']}" and password="${value['password']}";`
    return query(addSql)
}
//token写入
exports.writeToken = (value) => {
    let addSql = `UPDATE administrators SET token = ? WHERE Id = ?`;
    return query(addSql,value)
}
//查询token获取用户信息
exports.findDataByToken = (value) => {
    let addSql = `SELECT * from administrators where token="${value}";`
    return query(addSql)
}
//查询会员列表
exports.userList = (value) => {
    let val = utils.getList(value[0],value[1]);
    let search = value[2];
    let sql = 'SELECT id,name,tel,company,email,job,applyTime from users';
    let addSql = '';
    if(value[2]){
        addSql += ` where name = "${search}" or tel = "${search}"`
    }
    sql += addSql + ` order by applyTime desc limit ${val[0]}, ${val[1]} ; SELECT count(*) as count from users ` + addSql;
    console.log(sql)
    return query(sql)
}
//查询申请试用列表
exports.tryList = (value) => {
    let val = utils.getList(value.pageNum,value.pageSize);
    let search = value.search;
    let addSql = '';
    let addSqlList = ' SELECT * from user_tryout where';
    let addSqlCount = ' SELECT count(*) as count from user_tryout where'
    let i = 0;
    if(search){
        addSql += ` (userName = "${search}" or userTel = "${search}") `;
        i++;
    }
    if(value.applyStartTime&&value.applyEndTime){
        if(i == 1){
            addSql += 'and'
        }
        addSql += ` applyTime >= "${value.applyStartTime}" and applyTime <= "${value.applyEndTime}" `;
        i++;
    }
    if(value.examineStartTime&&value.examineEndTime){
        if(i >= 1){
            addSql += 'and'
        }
        addSql += ` examineTime >= "${value.examineStartTime}" and examineTime <= "${value.examineEndTime}" `
    }
    if(i == 0){
        addSqlList = addSqlList.substring(0,addSqlList.length-5);
        addSqlCount = addSqlCount.substring(0,addSqlCount.length-5);
    }
    addSqlList += addSql + ` order by applyTime desc limit ${val[0]}, ${val[1]} ;` + addSqlCount + addSql;
    return query(addSqlList)
}
//查询单条试用记录
exports.findTry = (value) => {
    let addSql = `SELECT * from administrators where token="${value['token']}" ; SELECT * from user_tryout where id = ${value['id']}`;
    return query(addSql)
}
//审核通过
exports.tryPass = (value) => {
    let addSql = `UPDATE user_tryout SET examineStatus = ?,examineTime = ?  WHERE Id = ?`;
    return query(addSql,value)
}