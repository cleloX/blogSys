const express = require('express');
const regist = express.Router();
const conn = require('../conn/mysql')
regist.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
});
regist.post('/', function(req, res) {
	console.log(req.session.current);
	res.cookie('login', 0)
  res.send('regist success!')
})



module.exports = regist