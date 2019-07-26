module.exports = function(app,db){
    var ObjectID = require('mongodb').ObjectID;
    const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.post('/api/v1/addCategory',(req,res)=>{
        const data = {
            name:req.body.name
        }
        db.collection('category').insert(data,(err,result)=>{
            if(err) return res.status(500).send({'error':'An error has occured','status_code':500});
            res.status(200).send({'result':result.ops[0],'status':'success','status_code':200});
        });
    });

    app.get('/api/v1/getCategory',(req,res)=>{
        db.collection('category').find({}).toArray(function(err,item){
            if(err){
                res.status(500).send({'error':'An error has occured','status_code':500});
            }
            else if(item){
                res.status(200).send({'result':item,'status':'success','status_code':200});
            }else{
                res.status(404).send({'error':'Not Found','status_code':404});
            }
        })
    });

    app.get('/api/v1/getCategory/:id',(req,res)=>{
        const id = req.params.id;
        const details = {'_id':new ObjectID(id)};
        db.collection('category').findOne(details,(err,item)=>{
            if(err){
                res.status(500).send({'error':'An error has occured','status_code':500});
            }else if(item){
                res.status(200).send({'result':item,'status':'success','status_code':200});
            }else{
                res.status(404).send({'error':'Not Found','status_code':404});
            }
        });
    });

    app.put('/api/v1/updateCategory/:id',(req,res)=>{
       const id = req.params.id;
       const details = {'_id':new ObjectID(id)};
       const data = {
           $set:{
               name:req.body.name
           }
       }
       db.collection('category').update(details,data,(err,item)=>{
            if(err){
                res.status(500).send({'error':'An error has occured','status_code':500});
            }else{
                res.status(200).send({'status':'success','status_code':200});
            }
       }); 
    });

    app.delete('/api/v1/deleteCategory/:id',(req,res)=>{
        const id = req.params.id;
        const details = {'_id':new ObjectID(id)};
        db.collection('category').remove(details,(err,item)=>{
            if(err){
                res.status(500).send({'error':'An error has occured','status_code':500});
            }else{
                res.status(200).send({'status':'success','status_code':200});
            }
        });
    });
}