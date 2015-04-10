/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');

var callback;


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:*************'));
db.once('open', function () {

    exports.models = {};
    
    console.log("database opened.");
    var userSchema = mongoose.Schema({
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: String,
        _workspaces: [{type: mongoose.Schema.Types.ObjectId, ref:"Workspace"}],
        _sharedWorkspaces: [{type: mongoose.Schema.Types.ObjectId, ref:"Workspace"}]
    });
    userSchema.plugin(deepPopulate, {
        whitelist: [
            '_workspaces',
            '_workspaces._databases',
            '_workspaces._owner',
            '_workspaces._collaborators',
            '_workspaces._databases._visualizations'
        ]
    });
    var User = mongoose.model('User', userSchema);
    
    
    var workspaceSchema = mongoose.Schema({
        name: String,
        _databases: [{type: mongoose.Schema.Types.ObjectId, ref:"Database"}],
        _owner: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
        _collaborators: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}]
    });
    var Workspace = mongoose.model('Workspace', workspaceSchema);
    
    
    var databaseSchema = mongoose.Schema({
        name: String,
        dataDir: String,
        _visualizations: [{type: mongoose.Schema.Types.ObjectId, ref:"Visualization"}],
        _workspace: {type: mongoose.Schema.Types.ObjectId, ref:"Workspace"}
    });
    var Database = mongoose.model('Database', databaseSchema);
    
    
    var visualizationSchema = mongoose.Schema({
        name: String,
        state: String,
        _database: {type: mongoose.Schema.Types.ObjectId, ref:"Database"},
        _workspace: {type: mongoose.Schema.Types.ObjectId, ref:"Workspace"}
    });

    var Visualization = mongoose.model('Visualization', visualizationSchema);
    
    
    
    exports.models.User = User;
    exports.models.Workspace = Workspace;
    exports.models.Database = Database;
    exports.models.Visualization = Visualization;
    
    
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