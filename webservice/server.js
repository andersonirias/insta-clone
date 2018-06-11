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
      collection.find().sort({_id: -1}).toArray(function(err, results){
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

app.post('/api', function(req, res){

  var date = new Date();
  time_stamp = date.getTime();

  var url_imagem = time_stamp + '_' + req.files.arquivo.originalFilename;
  var path_origem = req.files.arquivo.path;
  var path_destino = './uploads/' + url_imagem;

  fs.rename(path_origem, path_destino, function(err){

    if(err){

      res.status(500).json({error: err});
    return;

    }

    var dados = {
      url_imagem: url_imagem,
      titulo: req.body.titulo
    }

    db.open( function(err, mongoclient){

      mongoclient.collection('postagens', function(err, collection){

        collection.insert(dados, function(err, records){

          if(err){
   
            res.json({'status' : 'Falha ao realizar a inclusão'});

          } else {

            res.json({'status' : 'Inclusão realizada com sucesso'});

          }

          mongoclient.close();

        });

      });

    });

  });

});
