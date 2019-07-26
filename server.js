const express = require('express');
const mongoClient = require('mongodb').MongoClient;
const db = require('./config/db')
const app = express();
const port = 8000;

app.use('/upload',express.static('upload'));
app.use('/upload/recitation',express.static('recitation'));
app.use('/upload/ustadz',express.static('ustadz'));

mongoClient.connect(db.url,(err,database) => {
	if (err) return console.log(err)
	require('./app/routes')(app,database);
	app.listen(port,()=>{
		console.log('we are live on '+port);
	});
});
