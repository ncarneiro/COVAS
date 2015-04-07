/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




var mongoose = require('mongoose');

var callback;

console.log("fora");

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:*************'));
db.once('open', function () {

    exports.models = {};
    
    console.log("open");
    var userSchema = mongoose.Schema({
        nome: String,
        email: String,
        senha: String
    });

    var User = mongoose.model('User', userSchema);
    
    exports.models.User = User;
    
    
    
    callback();
    
});

;

exports.loadDatabase = function (cFunc) {
    callback = cFunc;
    mongoose.connect('mongodb://localhost/test');

};

exports.getModel = function(modelName){
    return exports.models[modelName];
};