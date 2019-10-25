/**
 * Created by yevheniia on 25.10.19.
 */
var spark = function () {

    var width = 200;
    var height = 80;
    var margin = {top: 10, bottom: 10, left:10, right:10};

    function chart(selection) {

        selection.each(function (data) {

            var bisectDate = d3.bisector(function (d) {
                return d.year;
            }).left;
            

            data.sort(function(a, b) {
                return a.year - b.year
            });

            var div = d3.select(this),
                svg = div.selectAll('svg').data([data]);

            var g = svg.enter()
                .append('svg')
                .attr('width', width + margin.right + margin.left)
                .attr('height', height + margin.bottom + margin.top)
                .append("g")
                .attr("transform",
                    "translate(" + 10 + "," + 10 + ")");


            var x = d3.scaleTime().range([0, width/2]);
            var y = d3.scaleLinear().range([height - margin.bottom - margin.top, 0]);


            // define the 1st line
            var line = d3.line()
                .x(function (d) {
                    return x(d.year);
                })
                .y(function (d) {
                    return y(d.thous);
                });

            x.domain([new Date(2001, 0, 1), new Date(2018, 11, 31)]);
            y.domain([0, d3.max(data, function (d) { return d.thous; })]);


            g.append("path")
                .style("fill", "transparent")
                .style("stroke", "rgb(187, 21, 26)")
                .style("stroke-width", "2px")
                .attr("d", line);

            g.append("rect")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", function () {
                    focus.style("display", null);
                })
                .on("mouseout", function () {
                    focus.style("display", "none");
                })
                .on("mousemove", mousemove);


            var focus = g.append("g")
                .attr("class", "focus")
                .style("display", "none")
               ;

            focus.append("circle")
                .attr("r", 3);

            focus.append("text")
                .attr("x", 9)
                .attr("dy", ".35em")
                .style("font-size", "0.8em")
                .style("fill", "black");

            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]),
                    i = bisectDate(data, x0, 1),
                    d0 = data[i - 1],
                    d1 = data[i],
                    d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                focus.attr("transform", "translate(" + x(d.year) + "," + y(d.thous) + ")");
                focus.select("text").text(d.thous);
            }

        });

    }

    return chart;

};