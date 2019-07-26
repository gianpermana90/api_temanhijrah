module.exports = function(app,db){
    var ObjectID = require('mongodb').ObjectID;
	const bodyParser = require('body-parser');
	const multer = require('multer');
	var fs = require('fs-extra');
	const upload = multer({
		storage:multer.diskStorage({
			destination: (req, file, callback) => {
		let path = './upload/ustadz';
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
    
    app.post('/api/v1/insertUstadz',(req,res)=>{
		const user = {
			name:req.body.name,
			image:'http://localhost:8000/upload/user_placeholder_man_0.jpg'
		}
		db.collection('ustadz').insert(user,(err,result)=>{
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else{
				res.status(200).send({'result':result.ops[0],'status':'success','status_code':200});
			}
		});
    });

    app.get('/api/v1/getUstadz',(req,res)=>{
		db.collection('ustadz').find({}).toArray(function(err,item){
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else if(item){
				res.status(200).send({'result':item,'status':'success','status_code':200});
			}else{
				res.status(404).send({'result':'not found','status_code':404});
			}
		});
	});

    app.get('/api/v1/getUstadz/:id',(req,res)=>{
		const id = req.params.id;
		const details = {'_id':new ObjectID(id)};
		db.collection('ustadz').findOne(details,(err,item)=>{
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else if (item) {
				res.status(200).send({'result':item,'status':'success','status_code':200});
			}else{
				res.status(404).send({'result':'not found','status_code':404});
			}
		});
    });
    
    app.put('/api/v1/updateUstadz/:id',(req,res)=>{
		const id = req.params.id;
		const details = {'_id':new ObjectID(id)};
		const user ={
			$set:{
				name:req.body.name,
			}
		}
		db.collection('ustadz').update(details,user,(err,item)=>{
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else{
				res.status(200).send({'result':item,'status':'success','status_code':200});
			}
		});
    });
    
    app.put('/api/v1/uploadImageUstadz/:id', upload.single('file'), function(req, res) {
		const id = req.params.id;
		const details = {'_id':new ObjectID(id)};
		const user ={
			$set:{
				image:'http://'+req.headers.host+'/upload/ustadz/'+req.file.originalname
			}
		}
		db.collection('ustadz').update(details,user,(err,item)=>{
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else{
				res.status(200).send({'status':'success','status_code':200});
			}
	  });
    });
    
    app.delete('/api/v1/deleteUstadz/:id',(req,res)=>{
		const id = req.params.id;
		const details = {'_id':new ObjectID(id)};
		db.collection('ustadz').remove(details,(err,item)=>{
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else{
				res.status(200).send({'status':'success','status_code':200});
			}
		})
	});
    
}