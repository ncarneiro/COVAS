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
    this.width = $(parentElement).innerWidth() - 10 - margin.left - margin.right;
    this.height = $(parentElement).innerHeight() - 10 - margin.top - margin.bottom;

    this.svg = d3.select(parentElement).append("svg")
            .attr("width", this.width + margin.left + margin.right)
            .attr("height", this.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var dots = this.svg.selectAll(".dot");
    dots.remove();
    var temp = dots.data(this.data).enter();

    if (this.forma === "circle") {

        this.dots = temp.append("circle")
                .attr("class", "dot")
                .attr("r", 3.5);
    } else if (this.forma === "rect") {
        this.dots = temp.append("rect")
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
                    return self.color_scale(d[self.color_data]);
                });
    }
    this.setYData(this.y_data);
    this.setXData(this.x_data);
    this.setColorData(this.color_data);


    this.svg.append("text")
            .attr("id", "legendName")
            .attr("class", "label")
            .attr("x", this.width - 5)
            .attr("y", 6)
            .style("text-anchor", "end")
            .text(this.columnsName[this.color_data])
            .on("click", function () {
                CustomMenu.showSimpleMenu(self.columnsName, function (id) {
                    self.setColorData(id);
                }, {event: d3.event, disabled: self.color_data});
            });

};


// -------------------  Getters and Setters ------------------------
ScatterPlot.prototype.setXData = function (propertyName) {
    this.x_data = propertyName;
    var self = this;
    if (typeof this.data[0][this.x_data] === "string") {
        var values = [];
        for (var i = 0; i < this.data.length; i++) {
            if (values.indexOf(this.data[i][this.x_data]) < 0) {
                values.push(this.data[i][this.x_data]);
            }
        }
        this.x_scale = d3.scale.ordinal()
                .rangePoints([0, this.width])
                .domain(values);
    } else if (typeof this.data[0][this.x_data] === "number") {
        this.x_scale = d3.scale.linear()
                .range([0, this.width])
                .domain(d3.extent(self.data, function (d) {
                    return d[self.x_data];
                })).nice();
    }

    var xAxis = d3.svg.axis()
            .scale(this.x_scale)
            .orient("bottom");

    var oldyaxi = this.svg.select("#xaxis");
    if (oldyaxi) {
        oldyaxi.remove();
    }

    this.svg.append("g")
            .attr("id", 'xaxis')
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", this.width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(this.columnsName[this.x_data])
            .on("click", function () {
                CustomMenu.showSimpleMenu(self.columnsName, function (id) {
                    self.setXData(id);
                }, {event: d3.event, disabled: self.x_data});
            });

    self.dots.attr("cx", function (d) {
        return self.x_scale(d[self.x_data]);
    });
};
ScatterPlot.prototype.getXData = function () {
    return this.x_data;
};
ScatterPlot.prototype.setYData = function (propertyName) {
    this.y_data = propertyName;
    var self = this;
    if (typeof this.data[0][this.y_data] === "string") {
        var values = [];
        for (var i = 0; i < this.data.length; i++) {
            if (values.indexOf(this.data[i][this.y_data]) < 0) {
                values.push(this.data[i][this.y_data]);
            }
        }
        this.y_scale = d3.scale.ordinal()
                .rangePoints([this.height, 0])
                .domain(values);
    } else if (typeof this.data[0][this.y_data] === "number") {

        this.y_scale = d3.scale.linear()
                .range([this.height, 0])
                .domain(d3.extent(self.data, function (d) {
                    return d[self.y_data];
                })).nice();
    }

    var yAxis = d3.svg.axis()
            .scale(this.y_scale)
            .orient("left");

    var oldyaxi = this.svg.select("#yaxis");
    if (oldyaxi) {
        oldyaxi.remove();
    }

    this.svg.append("g")
            .attr("id", 'yaxis')
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(this.columnsName[this.y_data])
            .on("click", function () {
                CustomMenu.showSimpleMenu(self.columnsName, function (id) {
                    self.setYData(id);
                }, {event: d3.event, disabled: self.y_data});
            });



    self.dots.attr("cy", function (d) {
        return self.y_scale(d[self.y_data]);
    });
};
ScatterPlot.prototype.getYData = function () {
    return this.y_data;
};
ScatterPlot.prototype.setColorData = function (propertyName) {
    this.color_data = propertyName;
    var self = this;
    if (typeof this.data[0][this.color_data] === "string") {
        this.color_scale = d3.scale.category10();
        for (var i = 0; i < this.data.length; i++) {
            this.color_scale(this.data[i][this.color_data])
        }
    } else if (typeof this.data[0][this.color_data] === "number") {
        this.color_scale = d3.scale.linear()
                .range(["blue", "red"])
                .domain(d3.extent(self.data, function (d) {
                    return d[self.color_data];
                })).nice();
    }

    this.svg.selectAll(".dot")
            .style("fill", function (d) {
                return self.color_scale(d[self.color_data]);
            });


    this.svg.select("#legendName")
            .text(this.columnsName[this.color_data]);
   
    this.svg.selectAll(".legend").remove();
    var legend = this.svg.selectAll(".legend")
            .data(this.color_scale.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

    legend.append("rect")
            .attr("x", this.width - 10)
            .attr("y", 12)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", this.color_scale);

    legend.append("text")
            .attr("x", this.width - 16)
            .attr("y", 20)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });

};
ScatterPlot.prototype.getColorData = function () {
    return this.color_data;
};
// ------------------------------------------------------------


