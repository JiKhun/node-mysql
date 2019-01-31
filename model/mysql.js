let mysql = require('mysql');//引入mysql模块
var databaseConfig = require('./mysql.config');  //引入数据库配置模块中的数据

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
//增加
exports.addData = () => {
    let addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)';
    var addSqlParams = ['菜鸟工具', 'https://c.runoob.com', '23453', 'CN'];
    return query(addSql, addSqlParams)
}
//删除
exports.deleteData = () => {
    let addSql = 'DELETE FROM websites where Id=8';
    return query(addSql)
}
//修改
exports.updataData = () => {
    let addSql = 'UPDATE websites SET name = ?,url = ? WHERE Id = ?';
    var addSqlParams = ['菜鸟移动站', 'https://m.runoob.com', 5];
    return query(addSql, addSqlParams)
}
//查询
exports.getData = () => {
    let addSql = 'SELECT * FROM websites';
    return query(addSql)
}



//注册
exports.userRegister = (value) =>{
    let addSql = 'INSERT INTO users(Id,name,tel,company,email,password,job,applyTime,token) VALUES(0,?,?,?,?,?,?,?,?)';
    return query(addSql, value)
}

//查询token获取用户信息
exports.findDataByToken = (value) => {
    let addSql = `select * from users where token="${value}";`
    return query(addSql)
}

//查询手机号码是否存在
exports.findDataByTel = (value) => {
    let addSql = `select * from users where tel="${value}";`
    return query(addSql)
}

//token写入
exports.writeToken = (value) => {
    let addSql = `UPDATE users SET token = ? WHERE Id = ?`;
    return query(addSql,value)
}

//插入用户试用记录
exports.addUserTryOut = (value) => {
    let addSql = `INSERT INTO user_tryout(Id,productId,applyTime,userId,productName,productDescribe) VALUES(0,?,?,?,?,?)`;
    return query(addSql,value)
}

//查询产品详情
exports.findDataByProduct = (value) => {
    let addSql = `select * from products where id="${value}";`;
    return query(addSql,value)
}
//查询用户是否申请过试用
exports.findUserIsTryout = (value) => {
    let addSql = `select * from user_tryout where userId = ? or productId = ?`;
    return query(addSql,value)
}
