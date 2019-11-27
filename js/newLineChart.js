/**
 * Created by yevheniia on 18.11.19.
 */
var parseDate = d3.timeParse("%Y");

var chart_data;
function retrieve_chart_data(cb) {
    if (chart_data) return cb(chart_data);

    return d3.csv("data/newLineChartData.csv", function(err, myData){
        if (err) throw err;

        myData.forEach(function (item) {
            item.code = +item.code;
            item.year = parseDate(item.year);
            item.Exported = +item.Exported  || 0;
            item.Imported = +item.Imported  || 0;
        });

        chart_data = myData;
        if (cb) return cb(myData);
        return;
    })
}

retrieve_chart_data(function(myData){
    var eu__I = [];
    var eu__E = [];
    var ru__I = [];
    var ru__E = [];

    myData.forEach(function(d) {
        if(d.country === "Росія" && d.code != "TOTAL" && d.product != "All products" && d.Exported > 0 && d.Exported > d.Imported ){
            ru__E.indexOf(d.product) === -1 ? ru__E.push(d.product) : console.log("");
        } else if (d.country === "Росія" && d.code != "TOTAL" && d.product != "All products" && d.Imported > 0 && d.Imported > d.Exported){
            ru__I.indexOf(d.product) === -1 ? ru__I.push(d.product) : console.log("");
        } else if (d.country === "ЄС" && d.code != "TOTAL" && d.product != "All products" && d.Imported > 0 && d.Imported > d.Exported){
            eu__I.indexOf(d.product) === -1 ? eu__I.push(d.product) : console.log("");
        } else if (d.country === "ЄС" && d.code != "TOTAL" && d.product != "All products" && d.Exported > 0 && d.Exported > d.Imported){
            eu__E.indexOf(d.product) === -1 ? eu__E.push(d.product) : console.log("");
        }
    });

    // var appendLi = function(dataset, container, country, type) {
    //     d3.select(container)
    //         .selectAll("li")
    //         .data(dataset)
    //         .enter()
    //         .append("li")
    //         .style("color", "grey")
    //         .text(function(d) {
    //             return d
    //         })
    //         .attr("country", country)
    //         .attr("type", type)
    //
    //         .on("click", function (item) {
    //             $(this).css("text-decoration", "underline");
    //             var country = $(this).attr("country");
    //             var type = $(this).attr("type");
    //             drawLines(myData, item, country, type);
    //         });
    // };

    //appendLi(eu__I, "#eu-i-items", "ЄС", "Imported");
    //appendLi(eu__E, "#eu-e-items", "ЄС", "Exported");
    //appendLi(ru__E, "#ru-e-items", "Росія", "Exported");
    //appendLi(ru__I, "#ru-i-items", "Росія", "Imported");

    ru__I.forEach(function(product){
        drawLines(myData, product, "Росія", "Imported");
    });


    ru__E.forEach(function(product){
        drawLines(myData, product, "Росія", "Exported");
    });

    $("#show-eu").on("click", function(d) {
        /* міняємо стиль кнопок */
        //$("#show-eu").prependTo("#ru-eu");
        d3.select("#show-ru").style("background-color", "white").style("color", "grey");
        d3.select("#show-eu").style("background-color", "grey").style("color", "white");
        d3.select("#selected-country").html("Торгівля з ЄС, 2002-2018");

        /* малюємо графіки */
        d3.selectAll(".svg-wrapper").remove();

        eu__I.forEach(function(product){
            drawLines(myData, product, "ЄС", "Imported");
        });


        eu__E.forEach(function(product){
            drawLines(myData, product, "ЄС", "Exported");
        });

        if(showExport === true){
            d3.selectAll(".svg-wrapper.Exported").style("display", "block");
            d3.selectAll(".svg-wrapper.Imported").style("display", "none");
        }


    });

    /* Показати Росію */
    $("#show-ru").on("click", function(d) {
        //$("#show-ru").prependTo("#ru-eu");
        d3.select("#show-eu").style("background-color", "white").style("color", "grey");
        d3.select("#show-ru").style("background-color", "grey").style("color", "white");
        d3.select("#selected-country").html("Торгівля з Росією, 2002-2018")
        
        
        d3.selectAll(".svg-wrapper").remove();
        
        ru__I.forEach(function(product){
            drawLines(myData, product, "Росія", "Imported");
        });


        ru__E.forEach(function(product){
            drawLines(myData, product, "Росія", "Exported");
        });

        if(showExport === true){
            d3.selectAll(".svg-wrapper.Exported").style("display", "block");
            d3.selectAll(".svg-wrapper.Imported").style("display", "none");
        }
    });
    
});


var drawLines = function(data, key, country, type) {


    //d3.select('#line-chart > svg').remove();

    var testData =  data
            .filter(function (d) {
                return d.country === country && d.product === key;
            })
            .sort(function (a, b) {
                return b.year - a.year
            });


    var margin = {top: 10, right: 0, bottom: 15, left: 5},
        width = 250 - margin.left - margin.right,
        height = 100 - margin.top - margin.bottom,
        rectWidth = 5;

    //linechartTest
    var svgContainer = d3.select("#line-chart")
        .append("div")
        .attr("class", "svg-wrapper "+ type)
        .style("width", '250px')
        .style("height", '200px');


          var svg = svgContainer.append("svg")
    //.attr("width", width + margin.left + margin.right)
    //.attr("height", height + margin.top + margin.bottom)
    //     .attr('preserveAspectRatio', "xMinYMin meet")
    //     .attr("viewBox", "0 0 400 200")

        .attr('width', '250px')
        .attr('height', '120px')
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var svgTitle = svgContainer
        .append("div")
        .attr("class", "svg-title")
        .style("width", '250px')
        .text(key);

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);


    // define the 1st line
    var valueline = d3.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d[type]);
        });

    // define the 2nd line
    var valueline2 = d3.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d[type]);
        });

    x.domain([new Date(2001, 0, 1), new Date(2018, 11, 31)]);
    //x.domain(d3.extent(testData, function (d) {  return d.year; }));
    y.domain([0, d3.max(testData, function (d) {
        return Math.max(d.Exported, d.Imported);
    })]);


    // Add the valueline path.
    svg.append("path")
        .data([testData])
        .attr("class", "valueline1")
        .style("stroke", type === "Exported" ? exColor : imColor)
        .attr("d", valueline);

    // // Add the valueline2 path.
    // svg.append("path")
    //     .data([testData])
    //     .attr("class", "valueline2")
    //     .style("stroke", imColor)
    //     .attr("d", valueline2);

    // svg.selectAll("line-circle")
    //     .data(testData)
    //     .enter().append("rect")
    //     .attr("class", "data-circle")
    //     .attr("width", rectWidth)
    //     .attr("height", rectWidth)
    //     .style("margin-left", -2.5)
    //     .attr("x", function(d) { return x(d.year)  - rectWidth/2; })
    //     .attr("y", function(d) { return y(d[type]) - rectWidth/2; })
    //     .attr("fill", type === "Exported" ? exColor : imColor);

    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y Axis
    // svg.append("g")
    //     .call(d3.axisLeft(y).ticks(5));


    // //labels
    // svg.append("text")
    //     .attr("transform", "translate(" + (width + 3) + "," + y(testData[0].Imported) + ")")
    //     .attr("dy", ".35em")
    //     .attr("text-anchor", "start")
    //     .style("fill", imColor)
    //     .text("Імпорт");
    //
    // svg.append("text")
    //     .attr("transform", "translate(" + (width + 3) + "," + y(testData[0].Exported) + ")")
    //     .attr("dy", ".35em")
    //     .attr("text-anchor", "start")
    //     .style("fill", "#c01788")
    //     .text("Експорт");

    d3.select("#linechart-title").text(key);

};
