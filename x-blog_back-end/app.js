const path = require('path')
const fs = require('fs')
//1//导入需要使用的模块（先安装）
//express框架
const express = require('express')
//处理post请求的数据
const bodyParser = require('body-parser')

//链接mysql数据库
const mysql = require('mysql')
//用于处理session
const session = require('express-session')
const { createProxyMiddleware } = require('http-proxy-middleware');



const app = express()
//在其他路由中间件前（尽可能靠前，以能够通过bodyParser获取req.body）
//(不加 可能无法获取到参数)
app.use(bodyParser.json())
// 注册解析表单数据的bodyParser
app.use(bodyParser.urlencoded({ extended: false}))
//设置静态资源
app.use(express.static(path.resolve(__dirname, './dist')))
// 你就可以通过带有 /image 前缀地址来访问 public 目录中的文件了。
app.use('/image', express.static(path.join(__dirname, './public')))
// app.use('/api', createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }));
app.use(
  session({
	name:'session',
    secret: '密钥',
    resave: false,
    saveUninitialized: false,
	cookie:{
		maxAge:1000*60*60*24*1
	}
  })
)
//引入数据库链接
const conn = require('./conn/mysql')
//解决跨域
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
});
const home = require('./router/home')
const test = require('./router/test')
const login = require('./router/login')
const regist = require('./router/regist')
//请求拦截，为路由请求匹配路径（当一级路由参数为home时，直接去一级路由admin对象里面）
app.use('/home',home);
app.use('/test',test);
app.use('/login',login)
app.use('/regist',regist)



app.post('/publishArticle', (req, res) => {
  // console.log(req.body+';'+'app.js:43');
  // console.log(req.body);
  let postData = {title, content, classifacation, time, author, author_id} = req.body
  let data = []
  // for (let i in postData){
  //   data.push(postData[i])
  // }
  Object.keys(postData).forEach((key) => {
    data.push(postData[key])
  })
  // console.log(data);
  let sql = 'insert into article(title,content,classifacation,time,author,author_id) value(?,?,?,?,?,?)'
  conn.query(sql, data, (err,result) => {
    if (err) {
      console.log(err)
      res.send(err)
    } else{
      // console.log(result)
	  res.cookie('isFirst', 1, { maxAge: 5000, singed: true});
	    res.cookie('isFirst2', 2, { maxAge: 5000, singed: true});
	  req.session.current = '插入信息'
			console.log(req.session);
      res.send('插入成功')
	  
    }
  })
  // res.send('response' )
});


app.post('/upLoad', require('./router/uploads/upload'))

app.get('/image/1', (req, res) => {
	res.sendFile(__dirname + '/public/uploads' + '/upload_2ccb4fc2cccd62a2178361383e524d1f.png')
})


app.get('*', function(req, res) {
  const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf-8')
  res.send(html)
})




app.listen(8081, function() {
  console.log('server running..........');
})
