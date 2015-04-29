/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var socket;

var ActiveVisManager;


(function ($) {

    var activeVis = [];
    ActiveVisManager = {
        openVisualization: function (id, opts) {

            //empty temporário
            var canvas = $("#mainVisCanvas").empty();
            
            CustomVisContainer.addContainer(canvas, id);

            switch (opts.technique) {
                case "scatterplot":
                    var scatterplot = new ScatterPlot("#vis_" + id, opts.state.data, {
                        columnsName: opts.columnsName,
                        x_data: 12,
                        y_data: 11,
                        color_data: 13,
                        onChange: function (obj) {
                            socket.sendToGroup(WebSocketManager.GROUP, obj, id);
                        }
                    });
                    scatterplot.id = id;
                    for (var i = 0; i < activeVis.length; i++) {
                        if (activeVis[i].id === scatterplot.id) {
                            activeVis.splice(i, 1);
                        }
                    }
                    activeVis.push(scatterplot);
                    break;
            }
        }
    };



    $(document).ready(function () {


        var websocketid = $("#inputWebsocketid").val();
        var email = $("#inputEmail").val();

        //Instancia a classe que gerencia a comunicação com o servidor
        socket = new WebSocketManager(location.host.split(":")[0], email, websocketid);

        socket.addFoward(WebSocketManager.AUTH, function (obj) {
            console.log(obj);
        });
        socket.addFoward(WebSocketManager.GROUP, function (obj, email, id) {
            console.log(typeof obj);
            for (var i = 0; i < activeVis.length; i++) {
                if (activeVis[i].id === id) {
                    activeVis[i][obj.methodName].apply(activeVis[i], obj.args);
                    break;
                }
            }
            console.log(obj, email, id);
        });

//        scatterplot = new ScatterPlot("#d3MainVisCanvasTeste", {}, "sepalLength", "sepalWidth");
//        scatterplot.drawPoints();
    });

})(jQuery);

