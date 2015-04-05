/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var fs = require("fs");

var dir;
var ModelNames = ["Users"];
var Models = [];
var SimpleFileDatabase = function(d){
    if(!d){
        dir = __dirname + "/storage";
    }
};

SimpleFileDatabase.prototype.loadDatabase = function(){
    
    for (var i = 0; i<ModelNames.length; i++){
        Models[ModelNames[i]] = JSON.parse(fs.readFileSync(dir+ModelNames[i]+".txt", "utf8")) || [];
    }
};

SimpleFileDatabase.prototype.getModel = function(modelName){
    
    return Models[modelName];
};

SimpleFileDatabase.prototype.addObjectToModel = function(obj, modelName){
    Models[modelName].push(obj);
    fs.writeFile(dir+modelName+".txt", JSON.stringify(Models[modelName]), {enconding:"utf8"}, function(){
        console.log("Nova persistência na base de dados.");
    });
};



exports.SimpleFileDatabase = SimpleFileDatabase;