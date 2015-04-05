

function runStaticServer(port) {
    var express = require("express");
    var multer = require('multer');
    var serveStatic = require('serve-static');
    var session = require('express-session');
    var path = require('path')
    var app = express();
    var done = false;

    var bodyParser = require('body-parser')



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
        if (req.body.email === "gustavo" && req.body.senha === "senha") {
            req.session.logged = true;
            req.session.email = req.body.email;
            res.redirect('/dashboard');
        } else {
            res.redirect('/login');
        }
    });

    app.use(function (req, res, next) {
        if (!req.session.logged) {
            res.redirect('/login');
        } else {
            next();
        }
    });



    app.use(serveStatic('./../client'));

    app.get("/dashboard", function (req, res) {
        res.sendFile(path.resolve("./../client/index.html"));
    });

    app.get("/logout", function (req, res) {
        req.session.logged = false;
        req.session.email = undefined;
        req.session.destroy(function () {
            res.redirect('/login');
        });
    });

    app.use(multer({dest: './uploads/',
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