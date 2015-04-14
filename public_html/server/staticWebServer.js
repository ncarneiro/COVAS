

var auth = require("./auth/AuthenticationManager.js").authManager;

function runStaticServer(port) {
    var express = require("express");
    var multer = require('multer');
    var serveStatic = require('serve-static');
    var session = require('express-session');
    var path = require('path');
    var app = express();
    var done = false;

    var ejs = require('ejs');

    var bodyParser = require('body-parser');
    
    var ajax = require('./communication/ajaxActions.js');

    app.set("view engine", "html");
    app.engine('html', ejs.renderFile);
    app.set("views", [path.resolve("./../client/pages"), path.resolve("./../client")]);

    app.use(session({
        secret: '12##labvis##21',
        resave: false,
        saveUninitialized: true
    }));

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.use(serveStatic('./../client/public'));

    app.get("/login", function (req, res) {
        res.sendFile(path.resolve("./../client/public/login.html"));
    });

    //FIXME USO Teste!! não está seguro!!!
    app.post("/logincred", function (req, res) {
        auth.authenticate(req.body.email, req.body.senha, function (authenticate) {
            if (authenticate) {
                req.session.logged = true;
                req.session.email = req.body.email;
                res.redirect('/dashboard');
            } else {
                res.redirect('/login');
            }
        });

    });

    app.use(function (req, res, next) {
        if (!req.session.logged) {
            res.redirect('/login');
        } else {
            next();
        }
    });



    app.use(serveStatic('./../client'));
    
    
    ajax.registerAjaxActions(app);
    

    app.use(multer({dest: './database/storage/temp',
        rename: function (fieldname, filename) {
            return filename + Date.now();
        },
        onFileUploadStart: function (file) {
            console.log(file.originalname + ' is starting ...');
        },
        onFileUploadComplete: function (file) {
            console.log(file.fieldname + ' uploaded to  ' + file.path);
            done = true;
        }
    }));

//app.get('/', function (req, res) {
//    res.sendFile(__dirname+"/../index.html");
////    res.end("foi")
//});

    app.post('/uploadfile', function (req, res) {
        if (done === true) {
            console.log(req.files);
            res.end("File uploaded.");
        }
    });

    app.listen((port || 3456), function () {
        console.log("Working on port " + (port || 3456));
    });
}


exports.runStaticServer = runStaticServer;