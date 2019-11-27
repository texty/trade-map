

var drawGeneral = function(data, country) {
    
    d3.select('#general-chart  > svg').remove();

    var general_data  = data
        .filter(function (d) {
            return d.country === country && d.code === "TOTAL" && d.product === "All products";
        })
        .sort(function (a, b) { return b.year - a.year  });
    
    console.log(general_data)

     
    var margin = {top: 20, right: 100, bottom: 30, left: 80},
            width = 700 - margin.left - margin.right,
            height = 150 - margin.top - margin.bottom;

        //linechartTest
    var svg = d3.select("#general-chart").append("svg")
            //.attr("width", width + margin.left + margin.right)
            //.attr("height", height + margin.top + margin.bottom)
            .attr( 'preserveAspectRatio',"xMinYMin meet")
            .attr("viewBox", "0 0 700 150")
            .attr('width', '100%')
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);


    var redline = d3.line()
        .x(function (d) { return x(d.year); })
        .y(function (d) { return y(d.Exported); });

    // define the 2nd line
    var blueline = d3.line()
        .x(function (d) { return x(d.year); })
        .y(function (d) { return y(d.Imported); });

    x.domain([new Date(2001, 0, 1), new Date(2018, 11, 31)]);
    //x.domain(d3.extent(testData, function (d) {  return d.year; }));
    y.domain([0, d3.max(testData, function (d) { return Math.max(d.Exported, d.Imported); })]);


    // Add the valueline path.
    svg.append("path")
        .data([testData])
        .attr("class", "valueline1")
        .style("stroke", "#c01788")
        .attr("d", valueline);

    // Add the valueline2 path.
    svg.append("path")
        .data([testData])
        .attr("class", "valueline2")
        .style("stroke", imColor)
        .attr("d", valueline2);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5));


    //labels
    svg.append("text")
        .attr("transform", "translate(" + (width + 3) + "," + y(testData[0].Imported) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", imColor)
        .text("Імпорт");

    svg.append("text")
        .attr("transform", "translate(" + (width + 3) + "," + y(testData[0].Exported) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "#c01788")
        .text("Експорт");

    d3.select("#linechart-title").text(key);

   //  //brush
   //  var brush = d3.brushX()
   //      .extent([[0, height], [width, height + 100]])
   //      .on("end", brushended);
   //
   // svg.append("g")
   //      .attr('class', 'brush')
   //      .call(brush)
   //      .call(brush.move, [x(new Date(2014, 0, 1)), x(new Date(2018, 11, 31))]);
   //
   //
   // function brushended() {
   //     //if (!d3.event.sourceEvent) return; // Only transition after input.
   //     if (!d3.event.selection) return; // Ignore empty selections.
   //
   //     var d0 = d3.event.selection.map(x.invert);
   //    
   //     var srartYear = Math.min(d0[0].getFullYear(), d0[1].getFullYear());
   //     var endYear = Math.max(d0[0].getFullYear(), d0[1].getFullYear());
   //
   //     //console.log(srartYear);
   //     //console.log(endYear);
   //   
   //     drawSankey(data, key, srartYear, endYear);
   // }


  
};



