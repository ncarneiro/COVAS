/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var http = require('http');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');

var express = require('express');
var multer = require('multer');

var done = false;

var app = express();
app.use(multer({dest: './uploads/',
    
    rename: function (fieldname, filename) {
        return filename+Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        done = true;
    }}));




app.get('/',function(req,res){
      res.sendFile("/home/gustavo/NetBeansProjects/CollaborativeVisualization/public_html/pages/uploadTeste.html");
});

app.post('/api/photo',function(req,res){
  if(done===true){
    console.log(req.files);
    res.end("File uploaded.");
  }
});

/*Run the server.*/
app.listen(8382,function(){
    console.log("Working on port 8382");
});
//http.createServer(function (req, res) {
//    console.log('request starting...');
//
//    var filePath = '../../..' + req.url;
//    if (req.url === '/'){
//        filePath = '../../../index.html';
//        console.log("alo");
//    }else if (req.url.toLowerCase() === '/uploadteste'){
//        filePath = '../../../pages/uploadTeste.html';
//        console.log("aaaaaa");
//    }else if(req.url.toLowerCase() === '/upload'
//            && req.method.toLowerCase() === 'post'){
//        
//        console.log("opa");
////        console.log(req.socket);
//        var body = "";
//        var POST = "";
//        req.on("data", function(chunk){
//            body += chunk;
//            
//        });
//        req.on("end", function(){
//            console.log(body);
//            POST = qs.parse(body);
//            console.log(POST);
//        });
////        var stream = fs.createWriteStream("../../../cloud/Teste.txt")
////        
////        req.pipe(stream);
//        filePath = '../../../pages/uploadTeste.html';
//    }
//        
//
//    var extname = path.extname(filePath);
//    var contentType = 'text/html';
//    switch (extname) {
//        case '.js':
//            contentType = 'text/javascript';
//            break;
//        case '.css':
//            contentType = 'text/css';
//            break;
//    }
//
//    path.exists(filePath, function (exists) {
//
//        if (exists) {
//            fs.readFile(filePath, function (error, content) {
//                if (error) {
//                    res.writeHead(500);
//                    res.end();
//                } else {
//                    res.writeHead(200, {'Content-Type': contentType});
//                    res.end(content, 'utf-8');
//                }
//            });
//        }
//        else {
//            res.writeHead(404);
//            res.end();
//        }
//    });
//
//}).listen(8382);
//console.log('Server running at http://127.0.0.1:8382/');