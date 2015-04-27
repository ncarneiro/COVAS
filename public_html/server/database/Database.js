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
        _workspaces: [{type: mongoose.Schema.Types.ObjectId, ref: "Workspace"}],
        _sharedWorkspaces: [{type: mongoose.Schema.Types.ObjectId, ref: "Workspace"}]
    });
    userSchema.plugin(deepPopulate, {
        whitelist: [
            '_workspaces',
            '_workspaces._databases',
            '_workspaces._owner',
            '_workspaces._collaborators',
            '_workspaces._databases._visualizations',
            '_sharedWorkspaces',
            '_sharedWorkspaces._databases',
            '_sharedWorkspaces._owner',
            '_sharedWorkspaces._collaborators',
            '_sharedWorkspaces._databases._visualizations'
        ]
    });
    var User = mongoose.model('User', userSchema);


    var workspaceSchema = mongoose.Schema({
        name: String,
        _databases: [{type: mongoose.Schema.Types.ObjectId, ref: "Database"}],
        _owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        _collaborators: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
    });
    workspaceSchema.pre('remove', function (next) {
        Database.find({_workspace: this._id}, function(err, databases){
            if(err) console.log('erro ao pesquisar bases para excluir');
            
            for(var i=0; i<databases.length; i++){
                databases[i].remove();
            }
            next();
        });
        
    });
    var Workspace = mongoose.model('Workspace', workspaceSchema);


    var databaseSchema = mongoose.Schema({
        name: String,
        dataDir: String,
        columnsName: [String],
        columnsType: [String],
        _visualizations: [{type: mongoose.Schema.Types.ObjectId, ref: "Visualization"}],
        _workspace: {type: mongoose.Schema.Types.ObjectId, ref: "Workspace"}
    });
    databaseSchema.pre('remove', function (next) {
        Visualization.remove({_database: this._id}, function(err){
            if(err) console.log('erro ao excluir visualizações');
        });
        //Excluir tbm o arquivo da pasta do usuário.
        next();
    });
    databaseSchema.plugin(deepPopulate, {
        whitelist: [
            '_workspace',
            '_workspace._owner',
            '_workspace._collaborators'
        ]
    });
    var Database = mongoose.model('Database', databaseSchema);


    var visualizationSchema = mongoose.Schema({
        name: String,
        state: mongoose.Schema.Types.Mixed,
        technique: String,
        history: [mongoose.Schema.Types.Mixed],
        _database: {type: mongoose.Schema.Types.ObjectId, ref: "Database"},
        _workspace: {type: mongoose.Schema.Types.ObjectId, ref: "Workspace"}
    });
    visualizationSchema.plugin(deepPopulate, {
        whitelist: [
            '_workspace',
            '_workspace._owner',
            '_workspace._collaborators'
        ]
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

exports.getModel = function (modelName) {
    return exports.models[modelName];
};