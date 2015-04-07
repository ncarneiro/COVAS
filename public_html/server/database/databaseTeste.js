/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var database = require("./Database.js");

database.loadDatabase(function(User){
    
    gustavo = new User({nome: "Gustavo2", email:"meuemail2@email.com", senha:"senha"});
    gustavo.save(function(err, gustavo){
        if (err) return console.error(err);
        
        console.log(gustavo);
        console.log("saved");
    });
    
    setTimeout(function(){
        User.find({ nome: "Gustavo" }, function(err, gustavo){
            console.log("encontrado:");
            console.log(gustavo);
        });
    }, 1000);
});


