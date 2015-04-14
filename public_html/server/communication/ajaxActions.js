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

    app.get("/logout", function (req, res) {
        req.session.logged = false;
        req.session.email = undefined;
        req.session.destroy(function () {
            res.redirect('/login');
        });
    });

    app.post("/dashboard/workspaces", function (req, res) {
        console.log("foi");
        facade.User.findUserByEmail(req.session.email, 
        "_workspaces._databases._visualizations _sharedWorkspaces._databases._visualizations",
        function(usuario){
            var userTree = facade.User.parseUserToTree(usuario);
            res.end(JSON.stringify(userTree));
        });
    });
    
    
    app.post("/dashboard/newworkspace", function(req, res){
        console.log("usuario criou novo workspace");
        res.end(JSON.stringify({status: "ok"}));
    });
    
};