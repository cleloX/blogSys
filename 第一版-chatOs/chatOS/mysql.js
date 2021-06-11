// 导入mysql模块
const mysql = require('mysql');


// 创建mysql的连接对象
  const conn = mysql.createConnection({
    host: 'localhost',
    user: 'test',
    password: '123456',
    database: 'test0'
  });

module.exports = conn;