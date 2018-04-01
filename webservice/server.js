var express = require('express'),
	bodyParser = require('body-parser'),
	multiparty = require('connect-multiparty'),
	mongodb = require('mongodb'),
	objectId = require('mongodb').ObjectId
	fs = require('fs');

var app = express();

app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());
app.use(multiparty());

app.use(function(req, res, next){

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
  
});

var port = 9090;

app.listen(port);

var db = new mongodb.Db(
  'instagram',
  new mongodb.Server('localhost', 27017, {}),
  {}
);

console.log('Servidor HTTP esta escutando na porta ' + port);

app.get('/api', function(req, res){
  db.open( function(err, mongoclient){
    mongoclient.collection('postagens', function(err, collection){
      collection.find().toArray(function(err, results){
        if(err){
		  res.json(err);
		} else {
		  res.json(results);
		}
		mongoclient.close();
	  });
	});
  });
});

app.get('/imagens/:imagem', function(req, res){
  var img = req.params.imagem;
  fs.readFile('./uploads/'+img, function(err, content){
    if(err){
      res.status(400).json(err);
      return;
    }
    res.writeHead(200, { 'content-type' : 'image/jpg'});
	res.end(content);
  })
});
