/**
 * Created by yevheniia on 25.10.19.
 */
var spark = function () {

    var width = 200;
    var height = 50;
    var margin = {top: 0, bottom: 0, left:0, right:0};

    function chart(selection) {

        selection.each(function (data) {
            
            
            data.sort(function(a, b) {
                return a.year - b.year
            });

            var div = d3.select(this),
                svg = div.selectAll('svg').data([data]);

            var g = svg.enter()
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .append("g")
                .attr("transform",
                    "translate(0, 0)");


            var x = d3.scaleTime().range([0, width]);
            var y = d3.scaleLinear().range([height, 0]);


            // define the 1st line
            var line = d3.line()
                .x(function (d) {
                    return x(d.year);
                })
                .y(function (d) {
                    return y(d.thous);
                });

            x.domain([new Date(2001, 0, 1), new Date(2018, 11, 31)]);
            //x.domain(d3.extent(testData, function (d) {  return d.year; }));
            y.domain([0, d3.max(data, function (d) { return d.thous; })]);


            g.append("path")
                .style("fill", "transparent")
                .style("stroke", "#33302e")
                .attr("d", line);

        });

    }

    return chart;

};