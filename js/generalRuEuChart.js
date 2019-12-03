

var drawGeneral = function(data, country) {

    var container = $("#general-chart")[0].getBoundingClientRect();

    var margin = {top: 20, right: 40, bottom: 30, left: 40},
        width = container.width - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom;

    d3.select('#general-chart  > svg').remove();
    var general_data  = data.filter(function (d) {
            return d.country === country && d.product === "All products";
        })
        .sort(function (a, b) { return b.year - a.year  });


    var svg = d3.select("#general-chart").append("svg")
        .attr('width', "100%")
        .attr('height', '150px')
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);


    var redline = d3.line()
        .x(function (d) { return x(d.year); })
        .y(function (d) { return y(d.Exported); });


    var blueline = d3.line()
        .x(function (d) { return x(d.year); })
        .y(function (d) { return y(d.Imported); });

    x.domain([new Date(2001, 0, 1), new Date(2018, 11, 31)]);
    //x.domain(d3.extent(testData, function (d) {  return d.year; }));
    y.domain([0, d3.max(general_data, function (d) { return Math.max(d.Exported, d.Imported); })]);


    svg.append("path")
        .data([general_data])
        .attr("class", "redline")
        .style("stroke", "#c01788")
        .attr("d", redline);

    // Add the valueline2 path.
    svg.append("path")
        .data([general_data])
        .attr("class", "blueline")
        .style("stroke", imColor)
        .attr("d", blueline);

    // Add the X Axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));






    svg.selectAll("data-circle")
        .data(general_data)
        .enter()
        .append("text")
        .filter(function(d, i) { return i === 0 || i === (general_data.length - 1) })
        .attr("class", "data-circle")
        .attr("width", 6)
        .attr("height", 6)
        .style("margin-left", -2.5)
        .attr("x", function(d) { return x(d.year)  - 20; })
        .attr("y", function(d) { return y(d["Imported"]) - 10; })
        .attr("fill", imColor)
        .text(function(d) {
            return "$ " + Math.floor(d["Imported"]/1000) + " млн"
        });

    svg.selectAll("data-circle")
        .data(general_data)
        .enter()
        .append("text")
        .filter(function(d, i) { return i === 0 || i === (general_data.length - 1) })
        .attr("class", "data-circle")
        .attr("width", 6)
        .attr("height", 6)
        .style("margin-left", -2.5)
        .attr("x", function(d) { return x(d.year)  - 20; })
        .attr("y", function(d) { return y(d["Exported"]) + 10; })
        .attr("fill", exColor)
        .text(function(d) {
            return "$ " + Math.floor(d["Exported"]/1000) + " млн"
        });

    // svg.selectAll("data-circle")
    //     .data(general_data)
    //     .enter()
    //     .append("rect")
    //     .attr("class", "data-circle")
    //     .attr("width", 5)
    //     .attr("height", 5)
    //     .style("margin-left", -2.5)
    //     .attr("x", function(d) { return x(d.year)  - 2.5; })
    //     .attr("y", function(d) { return y(d["Exported"]) - 2.5; })
    //     .attr("fill", exColor);


    $(window).on("resize", function(){
        var newContainer = $("#general-chart")[0].getBoundingClientRect();
        var newWidth = newContainer.width - margin.left - margin.right;


        var newX = d3.scaleTime()
            .range([0, newWidth])
            .domain([new Date(2001, 0, 1), new Date(2018, 11, 31)]);

        var newRedline = d3.line()
            .x(function (d) { return newX(d.year); })
            .y(function (d) { return y(d.Exported); });

        // define the 2nd line
        var newBlueline = d3.line()
            .x(function (d) { return newX(d.year); })
            .y(function (d) { return y(d.Imported); });
        
        svg.select(".x-axis")
            .transition()
            .duration(500)
            .call(d3.axisBottom(newX));

        svg.select(".redline")
            .transition()
            .duration(500)
            .attr("d", newRedline);

        svg.select(".blueline")
            .transition()
            .duration(500)
            .attr("d", newBlueline);

        svg.selectAll(".data-circle")
            .transition()
            .duration(500)
            .attr("x", function(d) { return newX(d.year)  - 2.5; })

           

    })

};
