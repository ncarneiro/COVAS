



//importa o módulo de comunicação com a base de dados.
var database = new require('./database/simpleFileDatabase.js').SimpleFileDatabase();

//importa os modelos do projeto.
var models = require('./model/Models.js').Models;

//carrega a base de dados.
database.loadDatabase();

exports.getModel = function(modelName){
    database.getModel("User");
};



