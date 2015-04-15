/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var facade = require('./../database/modelFacade.js');

exports.registerAjaxActions = function(app){
    
    app.get("/dashboard", function (req, res) {
        facade.User.findUserByEmail(req.session.email, "name email", function(user){
            res.render("index.html", {user: user});
        });
    });
    
    app.post("/dashboard/getitemdata", function(req, res){
        facade.Workspace.createNewEmptyWorkspace(req.body.name, req.session.email, function(proj, user){
            res.end(JSON.stringify({status: "ok"}));
        });
    });

    
    app.post("/dashboard/workspaces", function (req, res) {
        facade.User.findUserByEmail(req.session.email, 
        "_workspaces._databases._visualizations _sharedWorkspaces._databases._visualizations",
        function(usuario){
            var userTree = facade.User.parseUserToTree(usuario);
            res.end(JSON.stringify(userTree));
        });
    });
    
    
    app.post("/dashboard/newworkspace", function(req, res){
        facade.Workspace.createNewEmptyWorkspace(req.body.name, req.session.email, function(proj, user){
            res.end(JSON.stringify({status: "ok"}));
        });
    });
    
    
    app.post("/dashboard/deleteworkspace", function(req, res){
        facade.Workspace.removeWorkspace(req.body.id, req.session.email, function(suc){
            if(suc){
                res.end(JSON.stringify({status: "ok"}));
            }else{
                res.end(JSON.stringify({status: "error"}));
            }
        });
    });
    
    
    
    
    app.get("/logout", function (req, res) {
        req.session.logged = false;
        req.session.email = undefined;
        req.session.destroy(function () {
            res.redirect('/login');
        });
    });
};