module.exports = function(app,db){
	var ObjectID = require('mongodb').ObjectID;
	const bodyParser = require('body-parser');
	const multer = require('multer');
	var fs = require('fs-extra');
	var randomstring = require("randomstring");

	const upload = multer({
		storage:multer.diskStorage({
			destination: (req, file, callback) => {
		let path = './upload/user';
		fs.mkdirsSync(path);
		callback(null, path);
		},
		filename: (req, file, callback) => {
		//originalname is the uploaded file's name with extn
		callback(null, file.originalname);
		}
		})
	});
	app.use(bodyParser.urlencoded({ extended: true }));

	app.post('/api/v1/register',(req,res)=>{
		var token = randomstring.generate(12);
		const user = {
			username:req.body.username,
			firstName:req.body.firstName,
			lastName:req.body.lastName,
			birthday:req.body.birthday,
			gender:req.body.gender,
			email:req.body.email,
			phone:req.body.phone,
			password:req.body.password,
			accessToken:token,
			image:'http://localhost:8000/upload/user_placeholder_man_0.jpg'
		}
		db.collection('users').insert(user,(err,result)=>{
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else{
				res.status(200).send({'result':result.ops[0],'status':'success','status_code':200});
			}
		});
	});

	app.post('/api/v1/login',(req,res)=>{
		const details = {
			username:req.body.username,
			password:req.body.password
		}
		db.collection('users').findOne(details,(err,item)=>{
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else if (item) {
				res.status(200).send({'result':item,'status':'success','status_code':200});
			}else{
				res.status(404).send({'result':'not found','status_code':404});
			}
		});
	});

	app.get('/api/v1/getUser/:id',(req,res)=>{
		const id = req.params.id;
		const details = {'_id':new ObjectID(id)};
		db.collection('users').findOne(details,(err,item)=>{
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else if (item) {
				res.status(200).send({'result':item,'status':'success','status_code':200});
			}else{
				res.status(404).send({'result':'not found','status_code':404});
			}
		});
	});

	app.get('/api/v1/getUser',(req,res)=>{
		db.collection('users').find({}).toArray(function(err,item){
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else if(item){
				res.status(200).send({'result':item,'status':'success','status_code':200});
			}else{
				res.status(404).send({'result':'not found','status_code':404});
			}
		});
	});

	app.put('/api/v1/updateUser/:id',(req,res)=>{
		const id = req.params.id;
		const details = {'_id':new ObjectID(id)};
		const user ={
			$set:{
				username:req.body.username,
				firstName:req.body.firstName,
				lastName:req.body.lastName,
				birthday:req.body.birthday,
				gender:req.body.gender,
				email:req.body.email,
				phone:req.body.phone,
				password:req.body.password,
			}
		}
		db.collection('users').update(details,user,(err,item)=>{
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else{
				res.status(200).send({'result':item,'status':'success','status_code':200});
			}
		});
	});

	app.put('/api/v1/uploadImageProfile/:id', upload.single('file'), function(req, res) {
		const id = req.params.id;
		const details = {'_id':new ObjectID(id)};
		const user ={
			$set:{
				image:'http://'+req.headers.host+'/upload/user/'+req.file.originalname
			}
		}
		db.collection('users').update(details,user,(err,item)=>{
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else{
				res.status(200).send({'status':'success','status_code':200});
			}
	  });
	});

	app.delete('/api/v1/deleteUser/:id',(req,res)=>{
		const id = req.params.id;
		const details = {'_id':new ObjectID(id)};
		db.collection('users').remove(details,(err,item)=>{
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else{
				res.status(200).send({'status':'success','status_code':200});
			}
		})
	});

	app.put('/api/v1/gantiPassword/:id',(req,res)=>{
		const id = req.params.id;
		const details = {
			'_id':new ObjectID(id),
			password:req.body.password,
			accessToken:req.body.accessToken
		};
		const user ={
			$set:{
				password:req.body.newPassword,
			}
		}
		db.collection('users').update(details,user,(err,item)=>{
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else{
				res.status(200).send({'status':'success','status_code':200});
			}
		});
	});

	app.get('/api/v1/lupaPassword/:email',(req,res)=>{
		const details = {'email':req.params.email}
		db.collection('users').findOne(details,(err,item)=>{
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else if(item){
				res.status(200).send({'status':'success','status_code':200});
			}else{
				res.status(404).send({'status':'Not Found','status_code':404});
			}
		})
	});
	
	app.get('/api/v1/resetPassword/:id',(req,res)=>{
		const id = req.params.id;
		const details = {
			'_id':new ObjectID(id)
		}
		const user = {
			$set:{
				password:randomstring.generate(12)
			}
		}
		db.collection('users').update(details,user,(err,item)=>{
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else{
				res.status(200).send({'status':'success','status_code':200});
			}
		});
	});
}
