var drawGeneral = function(data, wrapper, selectedCountry, type) {

    const countries = ["загалом", "ЄС", "Росія", "Азія", "Африка", "США"];
    var container = $(wrapper)[0].getBoundingClientRect();

    const margin = {top: 20, right: 60, bottom: 30, left: 0},
        width = container.width - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    d3.select(wrapper +' > svg').remove();
    
    
    const general_data  = data
        .filter(function (d) {  return d.product === "All products"; })
        .sort(function (a, b) { return b.year - a.year  });


    var svg = d3.select(wrapper).append("svg")
        .attr('width', "100%")
        .attr('height', '300px')
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var line = d3.line()
        .x(function (d) { return x(d.year); })
        .y(function (d) { return y(d[type]); });

    x.domain([new Date(2001, 0, 1), new Date(2018, 11, 31)]);
    y.domain([0, d3.max(general_data, function (d) { return Math.max(d.Exported, d.Imported); })]);

    var min = d3.min(general_data, function (d) { return Math.max(d[type]); }),
        max = d3.max(general_data, function (d) { return Math.max(d[type]); });

    var colorImport = d3.scaleOrdinal()
        .domain(countries)
        .range(["#0c3255", "#165a99", "#4683bb", "#5d93c4", "#8cb2d5", "#a3c1dd"]);

    var colorExport = d3.scaleLinear()
        .domain([min, max])
        .range(["#e6a2cf", "#c01788"]);


    //функція відмальовки ліній для кожної країни
    var drawpath = function(country){
        var datapiece = general_data.filter(function(d) { return d.country === country});
        console.log(datapiece);
        
        // Add the valueline2 path.
        svg.append("path")
            .data([datapiece])
            .attr("class", "blueline")
            // .style("stroke", country === selectedCountry ? imColor : "grey")
            .style("stroke", function(k, i) {
                if(type === "Imported") {
                    return colorImport(k[i][type])
                } else {
                    return colorExport(k[i][type])
                }
            })
            .attr("d", line);




        svg.selectAll("data-circle")
            .data(datapiece)
            .enter()
            .append("text")
            .filter(function(d, i) { return i === 0  })
            .attr("class", "data-circle")
            .attr("width", 6)
            .attr("height", 6)
            .style("margin-left", -2.5)
            .attr("x", function(d) {  return x(d.year)  + 5; })
            .attr("y", function(d) {  return y(d[type]); })
            .attr("fill", function(d) {
                if(type === "Imported") {  return colorImport(d[type]); /* imColor */ }
                else { return colorExport(d[type]); /* exColor */  }
            })
            .text(function(d) {
                if(d.country === selectedCountry){ return "$ " + Math.floor(d[type]/1000) + " млн" }
                // else { return (d.country) }
            })
            .style("font-weight", function(d) {
                if(d.country === selectedCountry){ return "bold" }
                // else {  return "normal"  }
            });

    };


    for( var c in countries ){
        drawpath(countries[c]);
    }



    // Add the X Axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));






    // svg.selectAll("data-circle")
    //     .data(general_data)
    //     .enter()
    //     .append("text")
    //     .filter(function(d, i) { return i === 0 || i === (general_data.length - 1) })
    //     .attr("class", "data-circle")
    //     .attr("width", 6)
    //     .attr("height", 6)
    //     .style("margin-left", -2.5)
    //     .attr("x", function(d) { return x(d.year)  - 20; })
    //     .attr("y", function(d) { return y(d["Imported"]) - 10; })
    //     .attr("fill", imColor)
    //     .text(function(d) {
    //         return "$ " + Math.floor(d["Imported"]/1000) + " млн"
    //     });
    //
    // svg.selectAll("data-circle")
    //     .data(general_data)
    //     .enter()
    //     .append("text")
    //     .filter(function(d, i) { return i === 0 || i === (general_data.length - 1) })
    //     .attr("class", "data-circle")
    //     .attr("width", 6)
    //     .attr("height", 6)
    //     .style("margin-left", -2.5)
    //     .attr("x", function(d) { return x(d.year)  - 20; })
    //     .attr("y", function(d) { return y(d["Exported"]) + 10; })
    //     .attr("fill", exColor)
    //     .text(function(d) {
    //         return "$ " + Math.floor(d["Exported"]/1000) + " млн"
    //     });

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
        var newContainer = $(wrapper)[0].getBoundingClientRect();
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

        svg.selectAll(".blueline")
            .transition()
            .duration(500)
            .attr("d", newBlueline);

        svg.selectAll(".data-circle")
            .transition()
            .duration(500)
            .attr("x", function(d) { return newX(d.year)  - 2.5; })

           

    })

};
