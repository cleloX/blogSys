const express = require('express');
const login = express.Router();
const conn = require('../conn/mysql')
login.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
});
login.post('/', function(req, res) {
    var userName = req.body.loginName;
    var userPwd = req.body.password;
	// console.log(req.headers.cookie);
    // 构建sql语句查询数据库.
    const sql = 'select * from userinfo where email=? and pwd=?';
    conn.query(sql, [userName, userPwd], function(err, result) {
      // console.log(result.length);
        if (err) {
          // res.send({ msg: err, flag: 'no' });
            res.send({ msg: '数据查询错误!!', flag: 'no' });
        } else {
            if (result.length !== 1) {
                res.send({ msg: '用户邮箱和密码错误!!', flag: 'no' });
            } else {
                // session对象，可以将用户登录成功的信息存储到这个对象中，
                // 那么该对象中的数据会存储在服务器内存中。这样我们可以在任何的方法中获取该对象中的数据。注意：由于session中的数据存储在服务器内存中，所以在服务器重新启动后，session中的数据将丢失。
                // req.session.userId = result[0].id;
								let USER = 'user'+result[0].id;
								req.session[USER] = {
									id:result[0].id,
									name:result[0].name
								}
								console.log( req.session);
								res.cookie('login', 111)
                res.send({ msg: '恭喜登录成功了!!', flag: 'yes' });
            }
        }
    })
})



module.exports = login