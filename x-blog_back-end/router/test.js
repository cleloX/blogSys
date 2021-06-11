const express = require('express');
const app = express()
const test = express.Router();
//用于处理session
const session = require('express-session')
const { createProxyMiddleware } = require('http-proxy-middleware');
app.use(
  session({
	name:'session',
    secret: '密钥',
    resave: false,
    saveUninitialized: false,
	cookie:{
		// maxAge:1000*60*60*24*1
	}
  })
)

//解决跨域
test.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
});
test.post('/session', (req, res) => {
	req.session.index = 'that`s reqSession'
	// res.session.index1 'that`s resSession'
	// req.cookie('isFirst', 1, { maxAge: 6000 * 1000, singed: true});
	// res.cookie('isFirst2', 2, { maxAge: 6000 * 1000, singed: true});
	let data = {
		reqSession:req.session.index,
		// resSession:res.session,
		reqCookie:req.cookie,
		resCookie:res.cookie,
	}
	res.json(data)
})



module.exports = test