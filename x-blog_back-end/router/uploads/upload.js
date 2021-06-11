// 引入formidable第三方模块
const formidable = require('formidable');
const path = require('path');
const fs = require('fs')


module.exports = (req, res) => {
	// 
	// console.log('req:', req);
	// 1.创建表单解析对象
	const form = new formidable.IncomingForm();
	// 2.配置上传文件的存放位置
	form.uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');
	// 3.保留上传文件的后缀
	form.keepExtensions = true;
	// 4.解析表单
	form.parse(req, async (err, fields, files) => {
		// 1.err错误对象 如果表单解析失败 err里面存储错误信息 如果表单解析成功 err将会是null
		// 2.fields 对象类型 保存普通表单数据
		// 3.files 对象类型 保存了和上传文件相关的数据
		// res.send(files.cover.path.split('public')[1])
		// console.log('fields:', fields);
		// console.log('files:', files.item0.path.split('\\upload_')[0]);
		// console.log('-------------------');
		let arr = Object.values(files)
		// let dPath = ''
		arr.forEach(item => {
			fs.rename(item.path, path.join(item.path.split('\\upload_')[0],item.name), err => {
				if(err) throw err
			})
			// dPath = path.split('upload_')[0]
		})
		// console.log(arr.length);
		// for(iten of files){
		// 	// fs.rename
		// 	console.log(item.path.split(' '));
		// }
		
		
		res.send({url:'http://localhost:8081/image/uploads/upload_bd9db4cd46f320e206a97f7f911a30d2.png',fl:files});
		
	})
	// res.json(req)
}
