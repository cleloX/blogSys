const express = require('express');
const app = express();
const admin = express.Router();
admin.get('/',(req, res) => {
  res.render("admin/login");
  // res.send("nihao")
});
admin.post('/adminLogin', require('./adminLogin'));
module.exports = admin;
