module.exports = function(app,db){
	var ObjectID = require('mongodb').ObjectID;
	const bodyParser = require('body-parser');
	const multer = require('multer');
	var fs = require('fs-extra');
	const upload = multer({
		storage:multer.diskStorage({
			destination: (req, file, callback) => {
		let path = './upload/recitation';
		fs.mkdirsSync(path);
		callback(null, path);
		},
		filename: (req, file, callback) => {
		//originalname is the uploaded file's name with extn
		callback(null, file.originalname);
		}
		})
	});

	const field = multer();
	app.use(bodyParser.urlencoded({ extended: true }));

	app.post('/api/v1/insertSurah',field.fields([]),(req, res)=>{
        const surah = {
			'ustadzID' : req.body.ustadzID,
            'surah_name': req.body.surah_name,
            'juz': req.body.juz,
            'description': req.body.description
        }

        db.collection('surah').insert(surah,(err,result)=>{
            if(err){
                res.status(500).send({'error':'An error has occured','status_code':500});
            }else{
                res.status(200).send({'status':'success','status_code':200});
            }
        });
    });

    app.get('/api/v1/getSurah',(req,res)=>{
		db.collection('surah').find({}).toArray(function(err,item){
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else if(item){
				res.status(200).send({'result':item,'status':'success','status_code':200});
			}else{
				res.status(404).send({'result':'not found','status_code':404});
			}
		});
    });
    
    app.get('/api/v1/getSurah/:id',(req,res)=>{
        const id = req.params.id;
        const details = {'_id':new ObjectID(id)};
        db.collection('surah').findOne(details,(err,item)=>{
            if(err){
                res.status(500).send({'error':'An error has occured','status_code':500});
            }else if(item){
                res.status(200).send({'result':item,'status':'success','status_code':200});
            }else{
                res.status(404).send({'error':'Not Found','status_code':404});
            }
        });
    });
    
    app.put('/api/v1/updateSurah/:id',(req,res)=>{
		const id = req.params.id;
		const details = {'_id':new ObjectID(id)};
        const surah = {
            set:{
				'ustadzID': req.body.ustadzID,
                'surah_name': req.body.surah_name,
                'juz': req.body.juz,
                'description': req.body.description
            }
        }
		db.collection('surah').update(details,surah,(err,item)=>{
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else{
				res.status(200).send({'result':item,'status':'success','status_code':200});
			}
		});
    });
    
    app.delete('/api/v1/deleteSurah/:id',(req,res)=>{
		const id = req.params.id;
		const details = {'_id':new ObjectID(id)};
		db.collection('surah').remove(details,(err,item)=>{
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else{
				res.status(200).send({'status':'success','status_code':200});
			}
		})
	});

	app.post('/api/v1/insertAyat',upload.any(),function(req,res){
		
		const ayat = {
			'surahID': req.body.surahID,
			'noAyat': req.body.noAyat,
			'suara': 'http://'+req.headers.host+'/upload/recitation/'+req.files[0].originalname,
			'artiSuara': 'http://'+req.headers.host+'/upload/recitation/'+req.files[1].originalname,
			'textArab': req.body.textArab,
			'artiText': req.body.textArti 
		}

		db.collection('ayat').insert(ayat,(err,result)=>{
            if(err){
                res.status(500).send({'error':'An error has occured','status_code':500});
            }else{
                res.status(200).send({'status':'success','status_code':200});
            }
        });
	});
    
    app.get('/api/v1/getAyat/:id',(req,res)=>{
        const id = req.params.id;
        const details = {'surahID':id};
        db.collection('ayat').find(details).toArray(function(err,item){
            if(err){
                res.status(500).send({'error':'An error has occured','status_code':500});
            }else if(item){
                res.status(200).send({'result':item,'status':'success','status_code':200});
            }else{
                res.status(404).send({'error':'Not Found','status_code':404});
            }
        });
	});
	
	app.get('/api/v1/getAyat',(req,res)=>{
		db.collection('ayat').find({}).toArray(function(err,item){
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else if(item){
				res.status(200).send({'result':item,'status':'success','status_code':200});
			}else{
				res.status(404).send({'result':'not found','status_code':404});
			}
		});
	});
	
	app.delete('/api/v1/deleteAyat/:id',(req,res)=>{
		const id = req.params.id;
		const details = {'_id':new ObjectID(id)};
		db.collection('ayat').remove(details,(err,item)=>{
			if(err){
				res.status(500).send({'error':'An error has occured','status_code':500});
			}else{
				res.status(200).send({'status':'success','status_code':200});
			}
		})
	});
	
}
