let mysql = require('mysql');//引入mysql模块
let databaseConfig = require('../config');  //引入数据库配置模块中的数据

const pool = mysql.createPool({
    host: databaseConfig.HOST,
    port: databaseConfig.PORT,
    user: databaseConfig.USER,
    password: databaseConfig.PASSWORD,
    database: databaseConfig.DATABASE,
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

// let websites =
//     `create table if not exists websites(
//      id INT NOT NULL AUTO_INCREMENT,
//      name VARCHAR(100) NOT NULL COMMENT '名称',
//      url VARCHAR(100) NOT NULL COMMENT '地址',
//      alexa VARCHAR(100) NOT NULL COMMENT '排名',
//      country VARCHAR(100) NOT NULL COMMENT '国家',
//      PRIMARY KEY ( id )
//     );`
// let createTable = (sql) => {
//     return query(sql, [])
// }
// 建表
// createTable(websites)




//注册
exports.userRegister = (value) =>{
    let addSql = 'INSERT INTO users(Id,name,tel,company,email,password,job,applyTime,token) VALUES(0,?,?,?,?,?,?,?,?)';
    return query(addSql, value)
}

//查询token获取用户信息
exports.findDataByToken = (value) => {
    let addSql = `SELECT * from users where token="${value}";`
    return query(addSql)
}

//查询手机号码是否存在
exports.findDataByTel = (value) => {
    let addSql = `SELECT * from users where tel="${value}";`
    return query(addSql)
}

//token写入
exports.writeToken = (value) => {
    let addSql = `UPDATE users SET token = ? WHERE Id = ?`;
    return query(addSql,value)
}

//插入用户试用记录
exports.addUserTryOut = (value) => {
    let addSql = `INSERT INTO user_tryout(Id,productId,applyTime,userId,productName,productDescribe,userTel,userName,userEmail) VALUES(0,?,?,?,?,?,?,?,?)`;
    console.log(addSql)
    return query(addSql,value)
}

//查询产品详情
exports.findDataByProduct = (value) => {
    let addSql = `SELECT * from products where id="${value}";`;
    return query(addSql,value)
}
//查询用户是否申请过试用
exports.findUserIsTryout = (value) => {
    let addSql = `SELECT * from user_tryout where userId = ? and productId = ?`;
    return query(addSql,value)
}
