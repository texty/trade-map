/**
 * Created by yevheniia on 06.12.19.
 */
var drawMain = function() {
    var glines;
    var lines;
    var mouseG;
    var tooltip;

    var container = $("#general-chart")[0].getBoundingClientRect();
    
    var margin = {top: 20, right: 100, bottom: 40, left: 0};
    var width = container.width - margin.left - margin.right;
    var height = container.height - margin.top - margin.bottom;

    var lineOpacity = 1;
    var lineStroke = "2px";

    var axisPad = 6;
    var radius = 6;

    var category = ["загалом", "ЄС", "Росія", "Азія", "Африка", "США"];

    var colorBlue = d3.scaleOrdinal()
        .domain(category)
        .range(["#0c3255", "#165a99", "#4683bb", "#5d93c4", "#8cb2d5", "#a3c1dd"]);

    var colorPink = d3.scaleOrdinal()
        .domain(category)
        .range(["#600c44", "#c01788", "#c62e94", "#d35dac", "#e08bc4", "#ecb9db"]);

    d3.csv("data/index3_try.csv", function (err, data) {

        var res = data.map(function (d) {
            return {
                date: parseDate(d.year),
                type: +d.type,
                country: d.country,
                value: +d.value
            }
        });

        var xScale = d3.scaleTime()
            .domain([new Date(2001, 0, 1), new Date(2018, 11, 31)])
            .range([0, width]);

        function roundToNearest10K(x) {
            return Math.round(x / 10000) * 10000
        }

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(res, function (d) { return d.value })])
            .range([height, 0]);

        var canvas = d3.select("#general-chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

        var svg = canvas.append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale).ticks(10, "s").tickSize(-width);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", 'translate(0, ' + height + ')')
            .call(xAxis);

        var svgLegend = svg.append('g')
            .attr('class', 'gLegend')
            .attr("transform", "translate(" + (width + 20) + "," + 0 + ")");

        // var legend = svgLegend.selectAll('.legend')
        //     .data(category)
        //     .enter().append('g')
        //     .attr("class", "legend")
        //     .attr("transform", function (d, i) {
        //         return "translate(0," + i * 20 + ")"
        //     });
        //
        // legend.append("circle")
        //     .attr("class", "legend-node")
        //     .attr("cx", 0)
        //     .attr("cy", 0)
        //     .attr("r", radius)
        //     .style("fill", function(d) { return showImport ? colorBlue(d) : colorPink(d)});
        //
        // legend.append("text")
        //     .attr("class", "legend-text")
        //     .attr("x", radius * 2)
        //     .attr("y", radius / 2)
        //     .style("fill", "#A9A9A9")
        //     .style("font-size", 12)
        //     .text(function(d) { return d });

        var line = d3.line()
                .x(function (d) { return  xScale(d.date) })
                .y(function (d) { return yScale(d.value) });

        renderChart(1);

        d3.selectAll("#show-export").on('click', function () { updateChart(selectedCountry, 2);  });
        d3.selectAll("#show-import").on('click', function () { updateChart(selectedCountry, 1);  });

        d3.selectAll(".changeCountry").on("click", function() {
            updateChart(selectedCountry, selectedType)
        });

        $('select').on('change', function() {
            selectedCountry = this.value;
            updateChart(selectedCountry, selectedType);
        });




        function updateChart(selectedCountry, type) {
            var resNew = res.filter(function(d) { return d.type == parseInt(type); });

            var res_nested = d3.nest()
                .key( function(d) { return d.country })
                .entries(resNew);

            var newContainer = $("#general-chart")[0].getBoundingClientRect();
            var newWidth = newContainer.width;

            canvas.attr("width", newWidth + margin.left + margin.right);
            svg.attr("width", newWidth + margin.left + margin.right);

            var newX = d3.scaleTime()
                .range([0, newWidth - margin.left - margin.right])
                .domain([new Date(2001, 0, 1), new Date(2018, 11, 31)]);

            var newLine = d3.line()
                .x(function (d) { return  newX(d.date) })
                .y(function (d) { return yScale(d.value) });

            glines.select('.line')
                .data(res_nested)
                .transition().duration(750)
                .attr('d', function (d) {
                    return newLine(d.values)
                })
                // .style('stroke', function (d, i) { return showImport ? colorBlue(i) : colorPink(i)} );
                .style('stroke', function (d, i) { return d.key === selectedCountry ? tradeColor : "lightgrey" });

            glines.select('.data-circle')
                .data(res_nested)
                .transition()
                .duration(750)
                .attr("y", function(d, i) {
                    return yScale(d.values[17].value);
                })
                .attr('fill', function (d, i) {
                    return d.key === selectedCountry ? tradeColor : "lightgrey" });

            // legend.selectAll(".legend-node")
            //     .transition().duration(750)
            //     .style("fill", function (d) { return showImport ? colorBlue(d) : colorPink(d)});

            mouseG.selectAll('.mouse-per-line')
                .data(res_nested);

            mouseG.selectAll("circle")
                .transition().duration(750)
                .style("stroke", function (d) { return showImport ? colorBlue(d.key) : colorPink(d.key)});

            mouseG.on('mousemove', function () {
                var mouse = d3.mouse(this);
                updateTooltipContent(mouse, res_nested)
            })
        }

        function renderChart(type) {
            var resNew = res.filter(function(d) { return d.type == parseInt(type)});

            var res_nested = d3.nest()
                .key( function(d) { return d.country })
                .entries(resNew);

            lines = svg.append('g')
                .attr('class', 'lines');

            glines = lines.selectAll('.line-group')
                .data(res_nested).enter()
                .append('g')
                .attr('class', 'line-group');

            glines
                .append('path')
                .attr('class', 'line')
                .attr('d', function(d){ return line(d.values) })
                .style('stroke', function (d, i) { return d.key === selectedCountry ? tradeColor : "lightgrey" })
                .style('fill', 'none')
                .style('opacity', lineOpacity)
                .style('stroke-width', function (d, i) { return d.key === selectedCountry ? 2 : 1 });


            glines
                .append("text")
                .attr("class", "data-circle")
                .attr("x", function(d, i) {
                    return xScale(d.values[17].date) + 5;
                })
                .attr("y", function(d, i) {
                    return yScale(d.values[17].value);
                })
                .attr('fill', function (d, i) {
                    return d.key === selectedCountry ? tradeColor : "lightgrey" })
                .text(function(d, i) {
                    // if(d.key === selectedCountry){ return "$ " + Math.floor(d.values[17].value/1000) + " млн" }
                     return d.key
                });

            tooltip = d3.select("#general-chart").append("div")
                .attr('id', 'tooltip');
                

            mouseG = svg.append("g")
                .attr("class", "mouse-over-effects");

            mouseG.append("path") // create vertical line to follow mouse
                .attr("class", "mouse-line")
                .style("stroke", "#A9A9A9")
                .style("stroke-width", lineStroke)
                .style("opacity", "0");

            var lines = document.getElementsByClassName('line');

            var mousePerLine = mouseG.selectAll('.mouse-per-line')
                .data(res_nested)
                .enter()
                .append("g")
                .attr("class", "mouse-per-line");

            mousePerLine.append("circle")
                .attr("r", 4)
                .style("stroke", function (d) { return showImport ? colorBlue(d.key): colorPink(d.key) })
                .style("fill", "none")
                .style("stroke-width", lineStroke)
                .style("opacity", "0");

            mouseG.append('svg:rect')
                .attr('width', width)
                .attr('height', height)
                .attr('fill', 'none')
                .attr('pointer-events', 'all')
                .on('mouseout', function () {
                    d3.select(".mouse-line")
                        .style("opacity", "0");
                    d3.selectAll(".mouse-per-line circle")
                        .style("opacity", "0");
                    d3.selectAll(".mouse-per-line text")
                        .style("opacity", "0");
                    d3.selectAll("#tooltip")
                        .style('display', 'none')

                })
                .on('mouseover', function () {
                    d3.select(".mouse-line")
                        .style("opacity", "1");
                    d3.selectAll(".mouse-per-line circle")
                        .style("opacity", "1");
                    d3.selectAll("#tooltip")
                        .style('display', 'block')
                })
                .on('mousemove', function () {
                    var mouse = d3.mouse(this);
                    d3.selectAll(".mouse-per-line")
                        .attr("transform", function (d, i) {
                            var xDate = xScale.invert(mouse[0]);
                            var bisect = d3.bisector(function (d) {
                                return d.date;
                            }).left;
                            var idx = bisect(d.values, xDate);

                            d3.select(".mouse-line")
                                .attr("d", function () {
                                    var data = "M" + xScale(d.values[idx].date) + "," + (height);
                                    data += " " + xScale(d.values[idx].date) + "," + 0;
                                    return data;
                                });
                            return "translate(" + xScale(d.values[idx].date) + "," + yScale(d.values[idx].value) + ")";

                        });
                    updateTooltipContent(mouse, res_nested)

                })


        }


        $(window).on("resize", function(){
            var resNew = res.filter(function(d) { return d.type == parseInt(selectedType); });

            var res_nested = d3.nest()
                .key( function(d) { return d.country })
                .entries(resNew);

            var newContainer = $("#general-chart")[0].getBoundingClientRect();


            canvas.attr("width", newContainer.width + margin.left + margin.right);
            canvas.attr("width", newContainer.width + margin.left + margin.right);

           var newX = d3.scaleTime()
                .range([0, newContainer.width - margin.left - margin.right])
                .domain([new Date(2001, 0, 1), new Date(2018, 11, 31)]);

           var newLine = d3.line()
                .x(function (d) { return  newX(d.date) })
                .y(function (d) { return yScale(d.value) });

            svg.select(".x.axis")
                .transition()
                .duration(500)
                .call(d3.axisBottom(newX));

            svg.selectAll(".line")
                .transition()
                .duration(500)
                .attr('d', function(d){ return newLine(d.values) });

            svg.selectAll(".data-circle")
                .transition()
                .duration(500)
                .attr("x", function(d) { return newX(d.values[17].date) + 5 })

            //updateTooltipContent(mouse, res_nested)

        });
        
        
        //tooltip, base code took from here: https://bl.ocks.org/dianaow/0da76b59a7dffe24abcfa55d5b9e163e
        function updateTooltipContent(mouse, res_nested) {
            var sortingObj = [];
            res_nested.map(function(d) {
                var xDate = xScale.invert(mouse[0]);
                var bisect = d3.bisector(function (d) {  return d.date;  }).left;
                var idx = bisect(d.values, xDate);
                sortingObj.push({
                    key: d.values[idx].country,
                    value: d.values[idx].value,
                    type: d.values[idx].type,
                    year: d.values[idx].date.getFullYear(),
                    month: monthNames[d.values[idx].date.getMonth()]
                })
        });

            sortingObj.sort(function (x, y) {
                return d3.descending(x.value, y.value);
            });

            var sortingArr = sortingObj.map(function(d) { return  d.key });

            var res_nested1 = res_nested.slice().sort(function (a, b) {
                return sortingArr.indexOf(a.key) - sortingArr.indexOf(b.key); // rank vehicle category based on price of value
            });

            tooltip.html(sortingObj[0].year + " рік")
                .style('display', 'block')
                .style('left', d3.event.pageX + 20 + "px")
                .style('top', d3.event.pageY - 20 + "px")
                .style('font-size', "12px")
                .selectAll()
                .data(res_nested1).enter() 
                .append('div')
                .style('font-size', "12px")
                .html(function(d) {
                    var xDate = xScale.invert(mouse[0]);
                    var idx = bisect(d.values, xDate);
                    return d.key + " " + ": $ " + ((d.values[idx].value * 1000)/ 1000000000).toFixed(1) + " млрд";
                //return d.key + " " +  formatter.format(d.values[idx].value)
                }
            )
        }

    })
};

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

// drawMain("загалом");