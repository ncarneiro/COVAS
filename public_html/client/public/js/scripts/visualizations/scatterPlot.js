/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var ScatterPlot = function (pElement) {

    var parentElement = pElement;
    
    this.forma = "circle";

    this.data = [{sepalLength:5.1, sepalWidth:3.5, petalLength:1.4, petalWidth:0.2, species: "setosa"},
        {sepalLength:6.1, sepalWidth:3.5, petalLength:6.4, petalWidth:3.2, species: "setosa"},
        {sepalLength:8.1, sepalWidth:2.5, petalLength:4.4, petalWidth:2.2, species: "setosa"},
        {sepalLength:7.1, sepalWidth:1.5, petalLength:3.4, petalWidth:4.2, species: "virginica"},
        {sepalLength:9.1, sepalWidth:7.5, petalLength:9.4, petalWidth:1.2, species: "virginica"}];

    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    this.width = 960 - margin.left - margin.right,
    this.height = 500 - margin.top - margin.bottom;

    this.x = d3.scale.linear().range([0, this.width]);

    this.y = d3.scale.linear().range([this.height, 0]);

    this.color = d3.scale.category10();

    var xAxis = d3.svg.axis()
            .scale(this.x)
            .orient("bottom");

    var yAxis = d3.svg.axis()
            .scale(this.y)
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

        this.x.domain(d3.extent(this.data, function (d) {
            return d.sepalWidth;
        })).nice();
        this.y.domain(d3.extent(this.data, function (d) {
            return d.sepalLength;
        })).nice();

        this.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + this.height + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", this.width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text("Sepal Width (cm)");

        this.svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Sepal Length (cm)");
        

    

};

ScatterPlot.prototype.drawPoints = function(forma){
    this.svg.selectAll(".dot").remove();
    var temp = this.svg.selectAll(".dot")
                .data(this.data)
                .enter();
        
        var self = this;
        if(this.forma === "circle"){
            
            temp.append("circle")
                .attr("class", "dot")
                .attr("r", 3.5)
                .attr("cx", function (d) {
                    return self.x(d.sepalWidth);
                })
                .attr("cy", function (d) {
                    return self.y(d.sepalLength);
                })
                .style("fill", function (d) {
                    return self.color(d.species);
                });
        }else if(this.forma === "rect"){
            temp.append("rect")
                .attr("class", "dot")
                .attr("width", 7)
                .attr("height", 7)
                .attr("x", function (d) {
                    return self.x(d.sepalWidth);
                })
                .attr("y", function (d) {
                    return self.y(d.sepalLength);
                })
                .style("fill", function (d) {
                    return self.color(d.species);
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


