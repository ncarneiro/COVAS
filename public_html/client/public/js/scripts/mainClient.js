

(function($, d3){
    
    
    //socket utilizado para a comunicação com o servidor.
    var socket;
    //objeto compartilhado
    var squareTeste = {};
    var scatterplot;
    
    $(document).ready(function(){
    
        
        //Instancia a classe que gerencia a comunicação com o servidor
        socket = new WebSocketManager(location.host.split(":")[0]);
        
        
        socket.addFoward(WebSocketManager.TESTE, changeForma);
        
        
        $("#btnCirculo").click(function(){
            socket.send(WebSocketManager.TESTE, {forma: "circle"});
        });
        $("#btnQuadrado").click(function(){
            socket.send(WebSocketManager.TESTE, {forma: "rect"});
        });
       
        scatterplot = new ScatterPlot("#d3MainVisCanvasTeste", {}, "sepalLength", "sepalWidth");
        scatterplot.drawPoints();
    });
    
    
    
    
    function changeForma(obj){
        scatterplot.forma = obj.forma;
        scatterplot.drawPoints();
    }
    
    
    
})(jQuery, d3);



