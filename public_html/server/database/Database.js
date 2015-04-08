/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




var mongoose = require('mongoose');

var callback;


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:*************'));
db.once('open', function () {

    exports.models = {};
    
    console.log("database opened.");
    var userSchema = mongoose.Schema({
        nome: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        senha: String,
        _projetos: [{type: mongoose.Schema.Types.ObjectId, ref:"Workspace"}],
        _projetosCompartilhados: []
    });
    var User = mongoose.model('User', userSchema);
    
    
    var workspaceSchema = mongoose.Schema({
        nome: String,
        visualizacoes: [],
        bases: [String],
        criador: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
        colaboradores: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}]
    });

    var Workspace = mongoose.model('Workspace', workspaceSchema);
    
    
    
    
    exports.models.User = User;
    exports.models.Workspace = Workspace;
    
    
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