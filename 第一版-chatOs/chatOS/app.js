const path = require('path');
const moment = require('moment');
// const template = require('art-template');
//导入express模块
const express = require('express');

const app = express();
// 导入mysql模块
const mysql = require('mysql');
// 1.使用 app.set('view engine','模板引擎的名称'),渲染模板不写后缀时，自动添加“ejs”后缀
app.set('view engine', 'art');
// 2. 设置模板页面默认的存放路径，app.set('views','模板页面的具体存放路径')
app.set('views', path.join(__dirname,'Views'));
// 当渲染后缀为art的模板时 所使用的模板引擎是什么
app.engine('art', require('express-art-template'));
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
        secret: '密钥',
        resave: false,
        saveUninitialized: false
    })
)
const conn = require("./router/mysql");
// 创建mysql的连接对象
// const conn = mysql.createConnection({
//     host: 'localhost',
//     user: 'test',
//     password: '123456',
//     database: 'test0'
// });
//引入路由模块
const admin = require('./router/admin');
//请求拦截，为路由请求匹配路径（当一级路由参数为admin时，直接去一级路由admin对象里面）
app.use('/admin',admin);

// app.post('/adminLogin',
//   // require('./router/adminLogin')
//   function (req,res) {
//     res.render('admin/user')
//   }
// );
// const conn = mysql.createConnection({
//   host: '106.15.195.12',
//   user: 'root',
//   password: 'T426z436-',
//   database: 'myBlog',
//   port:3306
// });
// let classifacat='user';
// app.get('/index',async function(req, res) {
//   // if (req.session.userName == null){
//   //   req.app.locals.currentLink = '未登录'
//   // }
//   // res.render('index.art');
//   // var nid = req.query.id;
//   // const sql = 'select count(*) as coun from article'
//   const sql = 'select * from article';
//  let classifacat = req.query.classifacation;
//   conn.query(sql, {}, function(err, result) {
//     if (err) {
//       console.log(err);
//     } else {
//
//       if (typeof classifacat === 'undefined') {
//         classifacat='user';
//
//       //
//       }
//       // console.log(classifacat+"123");
//       // // //结果result为一个object类型（数组）
//       // //第一个参数为渲染的页面，
//       // //参数二：返回值必须为一个 对象
//       // res.render('index',result);
//       res.render('index.art', {result:result,classifacation:classifacat});
//       // res.send(result);
//       // return 0;
//
//       // //用Object.keys(result)方法获取键值或者索引。（如何boject为对象类型，则返回每一行的数据名）
//       // //结果为字符串数组
//       // // console.log(typeof Object.keys(result));
//       // let data_len = Object.keys(result).length;
//       // //获取最后一个人的id
//       // let last_id = result[data_len-1].id;
//       // console.log(last_id);
//
//     }
//   })
// })
app.get('/',async function(req, res) {
  res.redirect('/index');
})

app.get('/index',function(req, res) {
  const sql = 'select * from article';
  let classifacat = req.query.classifacation;
  // if (typeof classifacat === 'undefined') {
  //   classifacat='user';
  //
  //   //
  // }
  // console.log(classifacat);
  let datas = [];
  let results = [];
  conn.query(sql, {}, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      // console.log(result);
      // console.log(typeof result);
      // console.log("******************************************")
      // console.log([...result]);
      // console.log(typeof [...result]);

      for (let i=0;i<result.length;i++){
        if (result[i].classifacation === 'user'){
          results.push(result[i])
        }
        if (result[i].classifacation === classifacat){
          datas.push(result[i])
          // console.log(datas[i].classifacation)
        }
        else if (typeof classifacat === 'undefined' && result[i].classifacation !== 'user'){
          datas.push(result[i])
          // console.log(datas[i].classifacation)
        }
        // else{
        //   if (result[i].classifacation !== classifacat){
        //     datas.push(result[i])
        //   }
        //
        // }
      }
      // res.send(result);
      // console.log(results)
// console.log(datas);
      res.render('index.art', {result:results,data:datas});

    }
  })
})
app.get('/register',(req,res) => {
  res.render('register.art')
})

    // 判断邮箱
app.post('/checkEmail', function(req, res) {
    // 1:接收传递过来的邮箱
    var email = req.body.userEmail;
    // 2:才开始进行校验邮箱是否存在。
    //count(*) 统计数据的个数,统计的是满足条件的数据的个数。
    // counta 是别名，该名字随便起，存取了统计的数据
    const sql = 'select count(*) as counta from userinfo where email=?';
  // const sql = 'select * from userinfo where email=?';
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
                res.send({ msg: '此邮箱可用' });
            }
          // const n = result[0].name;
          // res.send({ msg: n});
          // console.log(result[0].name);
          // console.log(result[1]);
        }
    })

    // 3:把校验的结果返回。


})

app.post('/register', function(req, res) {
    // 1:接收数据
    var userName = req.body.name;
    var userPwd = req.body.pwd;
    var userEmail = req.body.email;
    let userRole = req.body.role;
    let userState = req.body.state;

    // 2:插入数据。insert
    const sqlStr = 'select count(*) as counta from userinfo where email=?';
    conn.query(sqlStr, userEmail, function(err, result) {

        if (err) return res.send({ msg: '查询错误', flag: 'no' });
        if (result[0].counta > 0) return res.send({ msg: '邮箱被占用了', flag: 'no' });
        const sql = 'insert into userinfo(name,pwd,email,role,state) values(?,?,?,?,?)';
        conn.query(sql, [userName, userPwd, userEmail, userRole, userState], function(e, strResult) {
            if (e) {
                res.send({ msg: '插入数据错误!!', flag: 'no' });
            } else {
                res.send({ msg: '注册成功！', flag: 'yes' });
            }
        })

    })
})
//首页注册
  app.get('/indexLogin', (req,res) => {
    res.render('index.art')
  })
app.post('/indexLogin', (req,res) => {
  // {indexName,indexPwd} = req.body;
  let indexEmail = req.body.indexEmail;
  let indexPwd = req.body.indexPwd;
  // console.log(indexEmail);



  const sql = 'select * from userinfo where email=? and pwd=?';
  conn.query(sql, [indexEmail, indexPwd], function(err, result) {
    // console.log(indexEmail);
    // console.log(result.length);
    if (err) {
      // res.send({ msg: '数据查询错误!!', flag: 'no' });
      console.log(err);
    } else {
      if (result.length !== 1) {
        // res.send({ msg: '用户邮箱和密码错误!!', flag: 'no' });
      } else {
        // session对象，可以将用户登录成功的信息存储到这个对象中，
        // 那么该对象中的数据会存储在服务器内存中。这样我们可以在任何的方法中获取该对象中的数据。注意：由于session中的数据存储在服务器内存中，所以在服务器重新启动后，session中的数据将丢失。
        req.session.userName = result[0].name;
        // if (req.session.userName != null){
        //   console.log("yes")
          req.app.locals.loginLink = '已登录';
        // }
        // res.send({ msg: '恭喜登录成功了!!', flag: 'yes' });
        // res.redirect('index.art');
        // req.app.locals.currentLink = '已登录';
        res.redirect('index');

      }
    }
  })
})


app.get('/login', function(req, res) {
    res.render('login.art');
})

// 完成用户的登录
app.post('/userLogin', function(req, res) {
    var userEmail = req.body.email;
    var userPwd = req.body.pwd;
    // 构建sql语句查询数据库.
    const sql = 'select * from userinfo where email=? and pwd=?';
    conn.query(sql, [userEmail, userPwd], function(err, result) {
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
                req.session.userName = result[0].name;
              req.app.locals.loginLink = '已登录';
                res.send({ msg: '恭喜登录成功了!!', flag: 'yes' });
            }
        }
    })
})

// 退出登录。
app.post('/userLoginLoinOut', function(req, res) {
    // 退出登录，就是清除session中的值.
    req.session.destroy(function() {
      console.log(req.session)
      // res.clearCookie('');
      req.app.locals.loginLink = '未登录';
        res.send({ flag: 'yes'});
      // res.redirect('index');
    })
})

// 展示添加文章的界面。
app.get('/showAddArticle', function(req, res) {
        // typeof判断类型
        // 如果下面的条件成立，表示没有值。
  // console.log("ahow");
        if (typeof req.session.userName === 'undefined') {
            // 如果没有值，跳转到登录页面，让用户登录.
            res.redirect('/login');
        } else {
          // console.log("add");
            res.render('addArticle.art', { userInfoName: req.session.userName });
        }

    })
    // 完成文章的添加保存
app.post('/addArticle', function(req, res) {
    // var title = req.body.title;
    // var content = req.body.content;
   let {title, content, time} = req.body;
    const sql = 'insert into article(title,content,author,classifacation,time) values(?,?,?,?,?)';
    conn.query(sql, [title, content, req.session.userName, 'user',time], function(err, result) {
        //  console.log(result);
        //在result这个对象中有一个insertId属性，保存了刚刚插入的数据的编号(id)
        if (err)
          return res.send({ msg: '文章添加失败！！', flag: 'no' });
          req.session.articleId=result.insertId
        res.send({
            msg: '文章添加成功',
            flag: 'yes',
            aid: result.insertId
        })
    })
})

//展示文章的详细信息
app.get('/showArticleDetail', function(req, res) {
    // 在articleDetail.art这个页面中展示用户刚添加完成的文章信息
    //用req.query进行接收。
    // req.session.articleId
    var aid = req.query.id;
    // 查询对对应的数据
    const sql = 'select * from article where article_id=?'
    conn.query(sql, aid, function(err, result) {
        if (err) {

        } else {
          // console.log(result[0])
          console.log("用户id："+req.session.userName)
          if (typeof req.session.userName === 'undefined'){
            res.redirect('register')
          } else{
            res.render('articleDetail.art', { title: result[0].title, content: result[0].content, author: result[0].author });

          }

        }
    })
})


//后台管理界面
app.get('/admin/user',async (req,res) => {
  const sql = 'select * from userinfo;' ;
  conn.query(sql,{},(err,result) => {
    if(err){
      console.log(err)
    }else{
      res.render("./admin/user.art",{users:result});
    }
  })
})

app.get('/admin/user-edit', (req,res) =>{

    // 标识 标识当前访问的是用户管理页面
    req.app.locals.currentLink = 'user';

    // 获取到地址栏中的id参数
    const   {message,id}  = req.query;
    // 如果当前传递了id参数
    if (id) {
      console.log(message)
      // console.log(id)
      const sql = 'select * from userinfo where id=?' ;
      conn.query(sql,id,(err,result) => {
        if(err){
          console.log(err)
        }else{
          // console.log(result[0])
          // console.log(result)
          res.render('./admin/user-edit.art', {
            message: message,
            user: result[0],
            link: '/admin/user-modify?id=' + id,
            button: '修改'
          });
        }
      })

      // 渲染用户编辑页面(修改)


    }else {
      // 添加操作
      res.render('user-edit.art', {
        message: message,
        link: '/admin/user-edit',
        button: '添加'
      });
    }
});
//添加用户
app.post('/admin/user-edit',(req,res) => {
  // 接收客户端传递过来的请求参数
  const { name, email, role, state, pwd } = req.body;
//差一个对数据库的插入操作
  res.redirect('/admin/user');
})


//修改
  app.post('/admin/user-modify',(req, res, next) => {
    // 接收客户端传递过来的请求参数
    const { name, email, role, state, pwd } = req.body;
    // 即将要修改的用户id
    const id = req.query.id;
    // 根据id查询用户信息
    const sql = 'select * from userinfo where id=?' ;
    conn.query(sql,id,(err,result) => {
      if(err) console.log(err);
      else{
        // console.log(pwd);
        // console.log(result[0]);
       if( result[0].pwd === pwd){
         // 密码比对

//缺少将信息插入数据库的  对数据库的操作
           // 将页面重定向到用户列表页面
           res.redirect('/admin/user');
         }else {
           // 密码比对失败
           let obj = {path: '/admin/user-edit', message: '密码错误,不能进行用户信息的修改', id: id}
           // next(JSON.stringify(obj));
         let arr = [];
         for (let i in obj){
           if (i !== "path"){
             arr.push(i+"="+obj[i]);
           }
         }
         // res.redirect(`${obj.path}?${arr.join('&')}`);
         // res.redirect(`/admin/user-edit?${arr.join("&")}`)
         res.redirect(`/admin/user-edit?message=${obj.message}&id=${obj.id}`)
         }

         // 密码比对
         // res.send(user);
       }
    });

  });

//删除用户
  app.get('/admin/delete', async (req,res) => {
  let id = req.query.id;
  //操作数据库，删除
  res.redirect('/admin/user');
})



//文章管理页面
app.get('/admin/article',(req,res) => {
  // req.app.locals.currentLink = 'article';
  const sql = 'select * from article';
  conn.query(sql,(err,result) => {
    if(err) console.log(err)
    else {
      // console.log(result)
      res.render('article',{article:result});
    }
  })

})

//文章
app.post('.admin/article', (req, res) => {

})


//文章编辑
app.get('/admin/article-edit', (req,res) => {
  res.render('./admin/article-edit.art');
})










app.listen(3000, function() {
    console.log('server running..........');
})
