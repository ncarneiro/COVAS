/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {



    //importa o módulo de gerenciamento de trocas de mensagens com clientes.
    var WebSocketManager = require('./communication/websocketsManager.js').WebSocketManager;
    // importa a biblioteca para manipular arquivos do disco local.
    //var fs = require('fs');

    var socketManager = new WebSocketManager();
    
    //Função apenas usa o broadcast, mas deve ser desenvolvida outras funcionalidades
    socketManager.addFoward(WebSocketManager.UPDATE, function(msg){
        socketManager.broadcast(WebSocketManager.UPDATE, msg);
    });
    
    //Função apenas usa o broadcast, mas deve ser desenvolvida outras funcionalidades
    socketManager.addFoward(WebSocketManager.TESTE, function(msg){
        socketManager.broadcast(WebSocketManager.TESTE, msg);
    });
    
    
    
    

})();