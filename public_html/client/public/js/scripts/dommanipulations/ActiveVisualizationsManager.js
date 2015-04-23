/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var ActiveVisManager = {
    openVisualization: function (id, opts) {
        switch (opts.technique){
            case "scatterplot":
                var scatterplot = new ScatterPlot("#d3MainVisCanvasTeste", opts.state.data, {
                    columnsName: opts.columnsName,
                    x_data: 12,
                    y_data: 11,
                    color_data: 13
                });
                scatterplot.drawPoints();
                break;
        }
        
    }

};