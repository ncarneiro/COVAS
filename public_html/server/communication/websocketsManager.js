/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 * Cria um objeto que gerencia o recebimento dos dados pela rede.
 * 
 * @returns {WebSocketManagerServer} 
 */
var WebSocketManager = function () {

    var self = this;

    //objeto que guarda os encaminhamentos
    self.foward = {};

    // biblioteca para comunicação via web sockets.
    var WebSocketServer = require('ws').Server;
    //cria um servidor na porta especificada
    self.wss = new WebSocketServer({port: 6661});
    //array contendo os IDs dos usuários
    self.IDs = [];
    //hash contendo os sockets dos usuários correlacionados com os ids.
    self.sokets = {};

    /*
     * Chama a função quando um cliente se conecta.
     */
    self.wss.on('connection', function (socket) {



        var aceito = false, id;
        while (!aceito) {
            id = Math.floor(Math.random() * 5000000);
            if (self.IDs.indexOf(id) === -1) {
                self.IDs.push(id);
                aceito = true;
            }
        }
         
        
        
        
        socket.send(JSON.stringify({obj: {id: id}, act: "id"}));
        socket.id = id;
        self.sokets[id] = socket;
        console.log("usuário conectado com id: " + id);


        /*
         * Chama a função quando um cliente envia uma mensagem.
         */
        socket.on('message', function (message, flags) {
            // Se a mensagem não é binária ela é do tipo String
            if (!flags.binary) {
                var objMsg = JSON.parse(message);
                self.foward[objMsg.act](objMsg.obj);
            }
        });

        //método chamado quando a conexão com um cliente é encerrada.
        socket.on('close', function () {
            // retira o id do usuário do array de ids.
            self.IDs.splice(self.IDs.indexOf(socket.id), 1);
            self.sokets[socket.id] = undefined;
            console.log("usuário " + socket.id + " desconectado.");
        });


    });


};


/**
 * Adiciona um comportamento para um determinada mensagem do seridor.
 * As possíveis mensagem que o servidor pode enviar estão listadas na classe
 * WebSocketManager como constantes. Exemplo: <code>WebSocketManager.CHAT</code> .
 * 
 * 
 * @param {string} name nome do comportamento esperado. Utilize uma das constantes
 * presentes em WebSocketManager.
 * 
 * @param {function} toFunc A função que deve ser chamada quando o cliente recebe uma 
 * mensagem do do tipo especificado no primeiro parâmentro "name". Esta função 
 * recebe por parâmentro o objeto com os dados que foram enviados do servidor.
 * 
 */
WebSocketManager.prototype.addFoward = function (name, toFunc) {
    this.foward[name] = toFunc;
};

/**
 * Envia dados para um cliente especificado pelo seu id.
 * @param {string} act Determina para qual ação esses dados são enviados. Utilize
 * as constantes do objeto WebSocketManager. 
 * 
 * @param {object} data dados a serem enviados.
 * 
 * @param {number} id do cliente destinatário da mensagem.
 * 
 */
WebSocketManager.prototype.send = function (act, data, id) {
    var self = this;
    this.socket.send(JSON.stringify({id: self.id, act: act, obj: data}));

};


/**
 * Envia dados para todos os clientes conectados atualmente.
 * @param {string} act Determina para qual ação esses dados são enviados. Utilize
 * as constantes do objeto WebSocketManager. 
 * 
 * @param {object} data dados a serem enviados.
 * 
 */
WebSocketManager.prototype.broadcast = function (act, data) {
    for (var i in this.wss.clients) {
        this.wss.clients[i].send(JSON.stringify({obj: data, act: act}));
    }
};



//-----------------------  Constantes ------------------------

WebSocketManager.UPDATE = "upd";
WebSocketManager.CHAT = "chat";
WebSocketManager.TESTE = "test";
WebSocketManager.AUTH = "auth";

exports.WebSocketManager = WebSocketManager;