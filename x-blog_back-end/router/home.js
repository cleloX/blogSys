const express = require('express');
const home = express.Router();
const conn = require('../conn/mysql')
const coment = require('moment')
// //解决跨域
// home.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
//   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//   next();
// });
home.get('/dataLists',(req, res) => {
  const sql = 'select * from article'
  conn.query(sql, {}, (err,result) =>{
    // console.log(coment(result[0].time).format('YYYY-MM-DD HH:mm:ss'));
    // console.log(coment().format('YYYY-MM-DD HH:mm:ss'));
    if (err){
      console.log(err);
    } else{
      // console.log(result);
      let jhc = []
      let vue = []
      let node = []
      let python = []
      let others = []
      result.forEach(item => {
        // console.log(item.time);
        if (item.time === null)  item.time = '超出时间之外'
        else item.time = coment(item.time).format('YYYY-MM-DD HH:mm:ss')
        if (item.classifacation === 'jhc') jhc.push(item)
        else if (item.classifacation === 'vue') vue.push(item)
        else if (item.classifacation === 'node') node.push(item)
        else if (item.classifacation === 'python') python.push(item)
        else if (item.classifacation === 'others') others.push(item)
      })

      res.json({
       all:result,
        jhc,
        vue,
        node,
        python,
        others

      })
    }
  })

})


module.exports = home


