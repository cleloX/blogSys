// 导入mysql模块
const mysql = require('mysql');
//用于配置环境
const config = require('config')
// console.log(config.get('db.HOST'));
// 创建mysql的连接对象
const conn = mysql.createConnection({
  host: config.get('db.HOST'),
  user: config.get('db.USER'),
  password: config.get('db.PASSWORD'),
  database: config.get('db.DATABASE')
});

module.exports = conn;
