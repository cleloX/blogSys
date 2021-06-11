//导入express模块
const express = require('express');
const app = express();
// 导入mysql模块
const mysql = require('mysql');
// 1.使用 app.set('view engine','模板引擎的名称')
app.set('view engine', 'ejs');
// 2. 设置模板页面默认的存放路径，app.set('views','模板页面的具体存放路径')
app.set('views', 'ejsViews');
//设置静态资源的访问路径，第一个参数，表示请求的url地址，第二个访问的文件夹。
app.use('/public', express.static('public'));
//导入body-parser模块,处理post过来的数据
const bodyParser = require('body-parser')
    // 注册解析表单数据的bodyParser.
app.use(bodyParser.urlencoded({ extended: false }))
    //  npm install express-session(通过该命令安装session对象)
const session = require('express-session');
app.use(
    session({
        secret: '这是加密的密钥',
        resave: false,
        saveUninitialized: false
    })
)

// 创建mysql的连接对象
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test0'
});
app.get('/', function(req, res) {
        res.render('register.ejs');

    })
    // 判断邮箱
app.post('/checkEmail', function(req, res) {
    // 1:接收传递过来的邮箱
    var email = req.body.userEmail;
    // 2:才开始进行校验邮箱是否存在。
    //count(*) 统计数据的个数,统计的是满足条件的数据的个数。
    // counta 是别名，该名字随便起，存取了统计的数据
    const sql = 'select count(*) as counta from userinfo where email=?';
    conn.query(sql, email, function(err, result) {
        if (err) {
            res.send({ msg: '查询失败' });
        } else {
            // 判断查询出来的记录的个数，如果大于0，表示传递过来的邮箱是在数据库中有的，那么这时返回的信息为'邮箱被占用'
            // 小于等于0,则邮箱可用。
            // result是数组;[  { counta: 1 } ]
            if (result[0].counta > 0) {
                res.send({ msg: '邮箱被占用了' });
            } else {
                res.send({ msg: '次邮箱可用' });
            }
        }
    })

    // 3:把校验的结果返回。

})

app.post('/register', function(req, res) {
    // 1:接收数据
    var userName = req.body.name;
    var userPwd = req.body.pwd;
    var userEmail = req.body.email;

    // 2:插入数据。insert (在向表中插入数据之前，有没有必要再次查询数据库判断用户输入的邮箱是否有相同的？？？)非常有必要。
    const sqlStr = 'select count(*) as counta from userinfo where email=?';
    conn.query(sqlStr, userEmail, function(err, result) {

        if (err) return res.send({ msg: '查询错误', flag: 'no' });
        // 如果执行了return，下面的代码都不会执行，
        if (result[0].counta > 0) return res.send({ msg: '邮箱被占用了', flag: 'no' });

        // 如果上面的条件都不成立。
        const sql = 'insert into userinfo(name,pwd,email) values(?,?,?)';
        conn.query(sql, [userName, userPwd, userEmail], function(e, strResult) {
            if (e) {
                res.send({ msg: '插入数据错误!!', flag: 'no' });
            } else {
                res.send({ msg: '注册成功！', flag: 'yes' });
            }
        })

    })



})
app.get('/login', function(req, res) {
    res.render('login.ejs');
})

// 完成用户的登录
app.post('/userLogin', function(req, res) {
    var userEmail = req.body.email;
    var userPwd = req.body.pwd;
    // 构建sql语句查询数据库.
    const sql = 'select * from userinfo where email=? and pwd=?';
    conn.query(sql, [userEmail, userPwd], function(err, result) {
        if (err) {
            res.send({ msg: '数据查询错误!!', flag: 'no' });
        } else {
            if (result.length !== 1) {
                res.send({ msg: '用户邮箱和密码错误!!', flag: 'no' });
            } else {
                // session对象，我们可以将用户登录成功的信息存储到这个对象中，
                // 那么该对象中的数据会存储在服务器内存中。这样我们可以在任何的方法中获取该对象中的数据。注意：由于session中的数据存储在服务器内存中，所以在服务器重新启动后，session中的数据将丢失。
                req.session.userName = result[0].name;
                res.send({ msg: '恭喜登录成功了!!', flag: 'yes' });
            }
        }
    })
})

// 退出登录。
app.post('/userLoginLoinOut', function(req, res) {
    // 退出登录，就是清除session中的值.
    req.session.destroy(function() {
        res.send({ flag: 'yes' });
    })
})

// 展示添加文章的界面。
app.get('/showAddArtice', function(req, res) {
        // typeof判断类型
        // 如果下面的条件成立，表示没有值。
        if (typeof req.session.userName === 'undefined') {
            // 如果没有值，跳转到登录页面，让用户登录.
            res.redirect('/login');
        } else {
            res.render('addArticel.ejs', { userInfoName: req.session.userName });
        }

    })
    // 完成文章的添加保存
app.post('/addArticel', function(req, res) {
    var title = req.body.atitle;
    var content = req.body.acontent;
    const sql = 'insert into articel(title,content,author) values(?,?,?)';
    conn.query(sql, [title, content, req.session.userName], function(err, result) {
        //  console.log(result);
        //在result这个对象中有一个insertId属性，保存了刚刚插入的数据的编号(id)
        if (err) return res.send({ msg: '文章添加失败！！', flag: 'no' });
        //   req.session.articelId=result.insertId
        res.send({
            msg: '文章添加成功',
            flag: 'yes',
            aid: result.insertId
        })
    })
})

//展示文章的详细信息
app.get('/showArticelDetail', function(req, res) {
    // 在articelDetail.ejs这个页面中展示用户刚添加完成的文章信息。
    //怎样获取用户刚刚添加完成的文章信息呢？在这里能够拿到用户刚刚插入的文章的编号（id）,
    // 那么根据该id，查询出对应的文章信息就可以了。
    //注意这里使用武力req.query进行接收。
    // req.session.articelId
    var aid = req.query.id;
    // 查询对对应的数据
    const sql = 'select * from articel where id=?'
    conn.query(sql, aid, function(err, result) {
        if (err) {

        } else {
            res.render('articelDetail.ejs', { title: result[0].title, content: result[0].content, author: result[0].author });
        }
    })


})

app.listen(3000, function() {
    console.log('server running..........');
})