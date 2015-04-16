/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var facade = require('./../database/modelFacade.js');


var multer = require('multer');
var fs = require("fs");
var done = false;

exports.registerAjaxActions = function (app) {

    app.get("/dashboard", function (req, res) {
        facade.User.findUserByEmail(req.session.email, "name email", function (user) {
            res.render("index.html", {user: user});
        });
    });

    app.post("/dashboard/getitemdata", function (req, res) {
        facade.User.getItemData(req.body, req.session.email, function (data) {
            res.end(JSON.stringify(data));
        });
    });


    app.post("/dashboard/workspaces", function (req, res) {
        facade.User.findUserByEmail(req.session.email,
                "_workspaces._databases._visualizations _sharedWorkspaces._databases._visualizations",
                function (usuario) {
                    var userTree = facade.User.parseUserToTree(usuario);
                    res.end(JSON.stringify(userTree));
                });
    });


    app.post("/dashboard/newworkspace", function (req, res) {
        facade.Workspace.createNewEmptyWorkspace(req.body.name, req.session.email, function (proj, user) {
            res.end(JSON.stringify({status: "ok"}));
        });
    });


    app.post("/dashboard/deleteworkspace", function (req, res) {
        facade.Workspace.removeWorkspace(req.body.id, req.session.email, function (suc) {
            if (suc) {
                res.end(JSON.stringify({status: "ok"}));
            } else {
                res.end(JSON.stringify({status: "error"}));
            }
        });
    });


    app.use(multer({dest: './database/storage/',
        onFileUploadStart: function (file) {
            console.log(file.originalname + ' is starting ...');
        },
        onFileUploadComplete: function (file) {
            console.log(file.fieldname + ' uploaded to  ' + file.path);
            done = true;
        },
        changeDest: function (dest, req, res) {
            var stat = null;
            console.log("req dest:");
            console.log(req.body);
            var newdest = dest + req.session.email;
            try {
                stat = fs.statSync(newdest);
            } catch (err) {
                fs.mkdirSync(newdest);
            }
            if (stat && !stat.isDirectory()) {
                console.log("erro: não é um diretório válido.");
            }
            return newdest;
        }
    }));

    app.post('/uploadfile', function (req, res) {
        if (done === true) {
            done = false;
            console.log(req.files);
            console.log(req.body);
            var dir = './database/storage/'+req.session.email+'/';
            if (req.body.itemId) {
                fs.renameSync(dir+req.files.base.name, 
                dir + req.body.itemId + req.files.base.extension);
                facade.Database
                        .createNewDatabase("Nova Base",
                                './database/storage/' + req.session.email,
                                req.body.itemId, req.session.email, function () {
                                    res.end(JSON.stringify({status: "ok", des: "File uploaded."}));
                                });
            }

        }
    });


    app.get("/logout", function (req, res) {
        req.session.logged = false;
        req.session.email = undefined;
        req.session.destroy(function () {
            res.redirect('/login');
        });
    });
};