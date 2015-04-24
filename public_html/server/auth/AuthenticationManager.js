/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */





var AuthenticationManager = {};


AuthenticationManager.authenticate = function (email, senha, callback) {
    
    
    global.database.models.User.findOne({ email: email }, function(err, user){
        if(err) {
            console.log(email+" não autenticado");
            callback(false);
        }else if(user && user.password === senha){
            console.log(email+" autenticado");
            callback(true);
        }else{
            console.log(email+" não autenticado");
            callback(false);
        }
    });
};

exports.authManager = AuthenticationManager;