/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function() {




// biblioteca para comunicação via web sockets.
var WebSocketServer = require('ws').Server;
// importa a biblioteca para manipular arquivos do disco local.
var fs = require('fs');
//cria um servidor na porta especificada
var wss = new WebSocketServer({port: 6661});
//array contendo os IDs dos usuários
var IDs = [];





    /*
     * Chama a função quando um cliente se conecta.
     */
    wss.on('connection', function(socket) {
        
        
        
        var aceito = false, id;
        while (!aceito) {
            id = Math.floor(Math.random() * 5000000);
            if (IDs.indexOf(id) === -1) {
                IDs.push(id);
                aceito = true;
            }
        }
        socket.send({obj: {id: id} , act:"id"});
        socket.id = id;
        console.log("usuário conectado com id: " + id);
        
        
        /*
         * Chama a função quando um cliente envia uma mensagem.
         */
        socket.on('message', function(message, flags) {
            console.log("mensagem recebida: " + message);
            // Se a mensagem não é binária ela é do tipo String
            if (!flags.binary) {
                var objMsg = JSON.parse(message);
                if(objMsg.act === "upd"){
                    //broadcast.
                    for (var i in wss.clients) {
                        wss.clients[i].send(JSON.stringify({obj: objMsg.obj ,act:"upd"}));
                    }
                }
                if(objMsg.act === "test"){
                    //broadcast.
                    for (var i in wss.clients) {
                        wss.clients[i].send(JSON.stringify({obj: objMsg.obj ,act:"test"}));
                    }
                }
            }
        });

        //método chamado quando a conexão com um cliente é encerrada.
        socket.on('close', function() {
            // retira o id do usuário do array de ids.
            IDs.splice(IDs.indexOf(socket.id), 1);
            console.log("usuário " + socket.id + " desconectado.");
        });
        
        
        
        
    });



})();