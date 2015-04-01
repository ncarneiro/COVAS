

var http = require('http');
var multipart = require('multipart');
var fs = require('fs');


var server = http.createServer(function (req, res) {
    res.writeHead(200);
    if (req.url === '/') {
        
        
//        res.writeHead(200, {'content-type': 'text/html'});
//        var fileStream = fs.createReadStream('../../../index.html');
//        fileStream.pipe(res);
//        res.end();
//        return;
        
        
        
        fs.readFile('../../../index.html', function(err, data){
            if(err) res.writeHead(404);
            
            res.writeHead(200, {'content-type': 'text/html'});
            res.write(data.toString('utf8'));
        });
        
        
        console.log(res.end());
        return;
        
    } else if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
        console.log("foi");
        return;
    } else {
        
        console.log(req.url);
        
        fs.readFile('../../..'+req.url, function(err, data){
            if(err){
                res.writeHead(404);
                console.log("erro");
                return;
            }
            res.write(data);
        });
        return;
    }

//    request.on('data', function (d) {
//
//        uploadedBytes += d.length;
//        var p = (uploadedBytes / fileSize) * 100;
//        response.write("Uploading " + parseInt(p) + " %\n");
//
//    });
//
//    request.on('end', function () {
//        response.end("File Upload Complete");
//    });
}).listen(8382, function () {
    console.log("foi");
});


