/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var ScatterPlot = function (pElement, data, opts) {

    var parentElement = pElement;

    this.forma = "circle";

    var self = this;

    this.data = data;

    this.columnsName = opts.columnsName;

    this.x_data = opts.x_data;
    this.y_data = opts.y_data;
    this.color_data = opts.color_data;


    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    this.width = $(parentElement).innerWidth()-10 - margin.left - margin.right;
    this.height = $(parentElement).innerHeight()-10 - margin.top - margin.bottom;

    this.x_scale = d3.scale.linear().range([0, this.width]);

    this.y_scale = d3.scale.linear().range([this.height, 0]);

    this.color = d3.scale.category10();

    var xAxis = d3.svg.axis()
            .scale(this.x_scale)
            .orient("bottom");

    var yAxis = d3.svg.axis()
            .scale(this.y_scale)
            .orient("left");

    this.svg = d3.select(parentElement).append("svg")
            .attr("width", this.width + margin.left + margin.right)
            .attr("height", this.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//        data.forEach(function (d) {
//            d.sepalLength = +d.sepalLength;
//            d.sepalWidth = +d.sepalWidth;
//        });

    this.x_scale.domain(d3.extent(this.data, function (d) {
        return d[self.x_data];
    })).nice();
    this.y_scale.domain(d3.extent(this.data, function (d) {
        return d[self.y_data];
    })).nice();

    //Configura os eixos da visualização
    this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", this.width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(this.columnsName[this.x_data])
            .on("click", function(){
                CustomMenu.showSimpleMenu(self.columnsName, function(id){
                    
                }, {});
            });

    this.svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(this.columnsName[this.y_data])
            .on("click", function(){
                
            });




};


// -------------------  Getters and Setters ------------------------
ScatterPlot.prototype.setXData = function (propertyName) {
    this.x_data = propertyName;
};
ScatterPlot.prototype.getXData = function () {
    return this.x_data;
};
ScatterPlot.prototype.setYData = function (propertyName) {
    this.y_data = propertyName;
};
ScatterPlot.prototype.getYData = function () {
    return this.y_data;
};
ScatterPlot.prototype.setColorData = function (propertyName) {
    this.color_data = propertyName;
};
ScatterPlot.prototype.getColorData = function () {
    return this.color_data;
};
// ------------------------------------------------------------



ScatterPlot.prototype.drawPoints = function (forma) {
    var self = this;
    var dots = this.svg.selectAll(".dot");
    dots.remove();
    var temp = dots.data(this.data).enter();


    if (this.forma === "circle") {

        temp.append("circle")
                .attr("class", "dot")
                .attr("r", 3.5)
                .attr("cx", function (d) {
                    return self.x_scale(d[self.x_data]);
                })
                .attr("cy", function (d) {
                    return self.y_scale(d[self.y_data]);
                })
                .style("fill", function (d) {
                    return self.color(d[self.color_data]);
                });
    } else if (this.forma === "rect") {
        temp.append("rect")
                .attr("class", "dot")
                .attr("width", 7)
                .attr("height", 7)
                .attr("x", function (d) {
                    return self.x_scale(d[self.x_data]);
                })
                .attr("y", function (d) {
                    return self.y_scale(d[self.y_data]);
                })
                .style("fill", function (d) {
                    return self.color(d[self.color_data]);
                });
    }

    var legend = this.svg.selectAll(".legend")
            .data(this.color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

    legend.append("rect")
            .attr("x", this.width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", this.color);

    legend.append("text")
            .attr("x", this.width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });
};


