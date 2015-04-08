/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var database = require("./Database.js");

database.loadDatabase(function(){
    
    var gustavo = new database.models.User({nome: "Gustavo", email:"meuemail@email.com", senha:"senha"});
    
    
    var projeto1 = new database.models.Workspace({nome:"projeto1", criador: gustavo._id});
    projeto1.save(function(err, pro){
        if (err) return console.error(err);
        
        console.log(pro);
        console.log("saved");
    });
    
    
    gustavo._projetos.push(projeto1._id);
    
    gustavo.save(function(err, gustavo){
        if (err) return console.error(err);
        
        console.log(gustavo);
        console.log("saved");
    });
});


