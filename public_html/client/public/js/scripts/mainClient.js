

(function($, d3){
    
    
    //socket utilizado para a comunicação com o servidor.
    var socket;
    //objeto compartilhado
    var squareTeste = {};
    var scatterplot;
    
    $(document).ready(function(){
    
        
        //Instancia a classe que gerencia a comunicação com o servidor
        socket = new WebSocketManager(location.host.split(":")[0]);
        
        socket.addFoward(WebSocketManager.UPDATE, updateSquare);
        socket.addFoward(WebSocketManager.TESTE, changeForma);
        
        $("#btnTeste").click(function(){
            drawsquare();
        });
        $("#btnCirculo").click(function(){
            socket.send(WebSocketManager.TESTE, {forma: "circle"});
        });
        $("#btnQuadrado").click(function(){
            socket.send(WebSocketManager.TESTE, {forma: "rect"});
        });
       
        d3.select("#d3MainVisCanvas")
                .append("svg")
                .append("rect")
                .attr("id", "rectTeste");
        
        scatterplot = new ScatterPlot("#d3MainVisCanvasTeste");
        scatterplot.drawPoints();
    });
    
    
    
    
    function drawsquare(){
        
        squareTeste.x = Math.round(Math.random()*70);
        squareTeste.y = Math.round(Math.random()*70);
        squareTeste.w = Math.round(Math.random()*70);
        squareTeste.h = Math.round(Math.random()*70);
        squareTeste.f = "rgb("+
                Math.round(Math.random()*256)+","+
                Math.round(Math.random()*256)+","+
                Math.round(Math.random()*256)+")";
        
        
        socket.send(WebSocketManager.UPDATE, squareTeste);
        
    }
    
    function updateSquare(obj){
        d3.select("#rectTeste")
                .attr("x", obj.x)
                .attr("y", obj.y)
                .attr("width", obj.w)
                .attr("height", obj.h)
                .style("fill", obj.f);
    }
    
    
    function changeForma(obj){
        scatterplot.forma = obj.forma;
        scatterplot.drawPoints();
    }
    
    
    
})(jQuery, d3);



