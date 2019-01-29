let mysql = require('mysql');//引入mysql模块
var databaseConfig = require('./mysql.config');  //引入数据库配置模块中的数据

const pool = mysql.createPool({
    host: databaseConfig.HOST,
    port: databaseConfig.PORT,
    user: databaseConfig.USER,
    password: databaseConfig.PASSWORD,
    database: databaseConfig.DATABASE,
});

let query = (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, params, (err, rows) => {
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

let websites =
    `create table if not exists websites(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT '名称',
     url VARCHAR(100) NOT NULL COMMENT '地址',
     alexa VARCHAR(100) NOT NULL COMMENT '排名',
     country VARCHAR(100) NOT NULL COMMENT '国家',
     PRIMARY KEY ( id )
    );`
let createTable = (sql) => {
    return query(sql, [])
}
// 建表
createTable(websites)
//增加
exports.addData = () => {
    let addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)';
    var addSqlParams = ['菜鸟工具', 'https://c.runoob.com', '23453', 'CN'];
    return query(addSql, addSqlParams)
}
//删除
exports.deleteData = () => {
    let addSql = 'DELETE FROM websites where id=8';
    var addSqlParams = [];
    return query(addSql, addSqlParams)
}
//修改
exports.updataData = () => {
    let addSql = 'UPDATE websites SET name = ?,url = ? WHERE Id = ?';
    var addSqlParams = ['菜鸟移动站', 'https://m.runoob.com', 5];
    return query(addSql, addSqlParams)
}
//查询
exports.getData = () => {
    let addSql = 'select * from websites';
    var addSqlParams = [];
    return query(addSql, addSqlParams)
}