const express = require("express");
const path = require("path");
const app = express();
const staticPath = path.join(__dirname,"static");
//共享静态文件
app.use(express.static(staticPath));
const mysql = require('mysql');
// 创建mysql的连接对象
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'test',
  password: '123456',
  database: 'blog'
});
const email = "123@123";
// let user = {
//   password:"",
//   username:"",
//   role:"",
//   state:"",
//   email:""
//
// }
 let role = 'select * from users where email=?';

conn.query(role, email, function(err, result) {
  if (err) {
    // res.send({ msg: '查询失败' });
  } else {
    console.log(result);
  }
})





app.listen(3000);
console.log("running......");