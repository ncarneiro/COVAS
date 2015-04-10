/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var database = require("./Database.js");

database.loadDatabase(function(){
    
    database.models.User.findOne({email: "meuemail@email.com"}, function(err, user){
        if(err)
            console.log("erro ao recuperar usuário, verifique se este usuário existe na base de dados.");
        
        var projeto2 = new database.models.Workspace({name:"projeto2", _owner: user._id});
        user._workspaces.push(projeto2._id);
        
        
        var base = new database.models.Database({name: "base1", _workspace: projeto2._id});
        projeto2._databases.push(base._id);
        
        var vis1 = new database.models.Visualization({
            name: "visualizacao1",
            _workspace: projeto2._id,
            _database: base._id
        });
        
        var vis2 = new database.models.Visualization({
            name: "visualizacao2",
            _workspace: projeto2._id,
            _database: base._id
        });
        base._visualizations.push(vis1._id);
        base._visualizations.push(vis2._id);
        
        
        
        
        user.save(function(err){ if (!err) console.log("user saved!"); });
        projeto2.save(function(err){ if (!err) console.log("projeto2 saved!"); });
        base.save(function(err){ if (!err) console.log("base saved!"); });
        vis1.save(function(err){ if (!err) console.log("vis1 saved!"); });
        vis2.save(function(err){ if (!err) console.log("vis2 saved!"); });
        
        
        
    });
    
    
    
    
});

