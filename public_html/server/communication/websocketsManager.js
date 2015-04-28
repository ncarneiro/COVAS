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

    self.logins = {};
    self.groups = {};

    //objeto que guarda os encaminhamentos
    self.foward = {};

    // biblioteca para comunicação via web sockets.
    var WebSocketServer = require('ws').Server;
    //cria um servidor na porta especificada
    self.wss = new WebSocketServer({port: 6661});
    //array contendo os IDs dos usuários
    self.IDs = [];
    //hash contendo os sockets dos usuários correlacionados com os ids.
    this.sockets = {};

    /*
     * Chama a função quando um cliente se conecta.
     */
    self.wss.on('connection', function (socket) {

        socket.authenticated = false;
        setTimeout(function () {
            if (!socket.authenticated){
                console.log("timeout");
                socket.close();
            }
        }, 30000);


        /*
         * Chama a função quando um cliente envia uma mensagem.
         */
        socket.on('message', function (message, flags) {
            // Se a mensagem não é binária ela é do tipo String
            if (!flags.binary) {
                if (socket.authenticated) {
                    var objMsg = JSON.parse(message);
                    self.foward[objMsg.act](objMsg.obj, objMsg.id, objMsg.email);
                } else {
                    if (message.length < 80) {
                        var objMsg = JSON.parse(message);
                        if (objMsg.email && objMsg.password &&
                                self.logins[objMsg.email] === objMsg.password) {
                            socket.authenticated = true;
                            socket.id = objMsg.password;
                            socket.email = objMsg.email;
                            self.sockets[objMsg.email] = socket;
                            socket.send(JSON.stringify({act: "auth", obj: true}));
                            return;
                        }
                    }
                    console.log("socket close");
                    socket.close();
                }
            } else {
                if (!socket.authenticated) {
                    socket.close();
                }
            }
        });

        //método chamado quando a conexão com um cliente é encerrada.
        socket.on('close', function () {
            // retira o id do usuário do array de ids.
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

WebSocketManager.prototype.sendToGroup = function (act, data, idGroup, exc) {
    if(exc){
        for (var i=0; i<this.groups[idGroup].length; i++){
            if(exc !== this.groups[idGroup][i]){
                this.sockets[this.groups[idGroup][i]]
                     .send(JSON.stringify({act: act, obj: data, id: idGroup, email: exc}));
            }
        }
    }else{
        for (var i=0; i<this.groups[idGroup].length; i++){
             this.sockets[this.groups[idGroup][i]]
                     .send(JSON.stringify({act: act, obj: data, id: idGroup}));
        }
    }
    this.groups[idGroup];
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

WebSocketManager.prototype.addLogin = function (email, password) {
    if (!this.logins[email]) {
        this.logins[email] = password;
        return true;
    } else {
        return false;
    }
};

WebSocketManager.prototype.removeLogin = function (email) {
    if (this.logins[email]){
        //verificar se o socket ainda existe e remove-lo tbm.
        this.logins[email] = undefined;
    }
    return true;
};


WebSocketManager.prototype.addInGroup = function (groupId, email) {
    if (this.groups[groupId]){
        for(var i=0; i<this.groups[groupId].length; i++){
            if(this.groups[groupId][i] === email){
                return false;
            }
        }
        this.groups[groupId].push(email);
    }else{
        this.groups[groupId] = [email];
    }
    return true;
};

WebSocketManager.prototype.removeFromGroup = function (groupId, email) {
    if (this.groups[groupId]){
        for(var i=0; i<this.groups[groupId].length; i++){
            if(this.groups[groupId][i] === email){
                this.groups[groupId].splice(i, 1);
                if(this.groups[groupId].length === 0){
                    this.groups[groupId] = undefined;
                }
                return true;
            }
        }
    }
    return false;
};

//-----------------------  Constantes ------------------------

WebSocketManager.UPDATE = "upd";
WebSocketManager.CHAT = "chat";
WebSocketManager.TESTE = "test";
WebSocketManager.AUTH = "auth";
WebSocketManager.GROUP = "group";

exports.WebSocketManager = WebSocketManager;
