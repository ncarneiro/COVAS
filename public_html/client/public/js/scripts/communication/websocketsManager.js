/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 * Recebe o host e cria um objeto que gerencia a comunicação dos dados pela rede
 * 
 * @param {string} host nome ou endereço IP do servidor
 * @returns {WebSocketManager} 
 */
var WebSocketManager = function(host, email, id){
    
    var self = this;
    self.socket = new WebSocket("ws://" + host + ":" + 6661);
    
    //objeto que guarda os encaminhamentos
    self.foward = {};
    self.id = id;
    self.email = email;
    self.socket.onopen = function() {
        console.log("conexão aberta");
        self.socket.send(JSON.stringify({email: email, password: id}));
    };
        
    //método chamado quando ocorre um erro no socket de comunicação com servidor.
    self.socket.onerror = function(e) {
        console.log(e);
    };
    
    self.socket.onclose = function() {
        console.log('CLOSED');
    };
    
    self.socket.onmessage = function(e) {
        var objMsg = JSON.parse(e.data);
        self.foward[objMsg.act](objMsg.obj, objMsg.email, objMsg.id);
    };
    
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
WebSocketManager.prototype.addFoward = function(name, toFunc){
    this.foward[name] = toFunc;
};


/**
 * Retorna true a conexão estiver pronta e false caso contrário.
 * @returns {boolean} estado da conexão.
 */
WebSocketManager.prototype.isReady = function(){
    return this.socket.readyState;
};


/**
 * Envia dados para o servidor.
 * @param {string} act Determina para qual ação esses dados são enviados. Utilize
 * as constantes do objeto WebSocketManager. 
 * 
 * @param {object} data dados a serem enviados.
 * 
 */
WebSocketManager.prototype.send = function(act, data){
    var self = this;
    this.socket.send(JSON.stringify({email:self.email, act:act, obj:data}));
};

WebSocketManager.prototype.sendToGroup = function(act, data, idGroup){
    var self = this;
    this.socket.send(JSON.stringify({id: idGroup, email:self.email, act:act, obj:data}));
};


WebSocketManager.UPDATE = "upd";
WebSocketManager.CHAT = "chat";
WebSocketManager.TESTE = "test";
WebSocketManager.AUTH = "auth";
WebSocketManager.GROUP = "group";




