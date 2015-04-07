/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



//----------------------------  User ------------------------------------
var usersHash = [];
var User = (function () {

    var globalIDs = [];

    return (function (options) {

        if((typeof options.email) !== 'string'){
            throw "email inválido, um email válido precisa ser fornecido.";
        }else if(globalIDs.contains(options.email)){
            throw "email de usuário já cadastrado.";
        }
        
        for (var opt in options) {
            this[opt] = options[opt];
        }

        this.nome = this.nome || "Usuario" + Math.floor((Math.random() * 999));
        this.myworkspaces = [];
        this.sharedworkspaces = [];
        
        usersHash[this.email] = this;
    });
})();

//Método Estático de usuário para encontrar um usuário.
User.findUserByEmail = function(email){
    return usersHash[email];
};
User.modelName = "User";
//----------------------------  User ------------------------------------


var Models = {};
Models[User.modelName] = User;
exports.Models = Models;
