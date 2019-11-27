/**
 * Created by yevheniia on 18.11.19.
 */
var parseDate = d3.timeParse("%Y");

var margin = {top: 10, right: 20, bottom: 15, left: 20},
    width = 300 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom,
    rectWidth = 5;


retrieve_chart_data(function(myData){
    var ExpArr_ru = [];
    var ImpArr_ru = [];
    var ExpArr_eu = [];
    var ImpArr_eu = [];

    myData.forEach(function(d) {
        if(d.country === "Росія" && d.code != "TOTAL" && d.product != "All products" && d.Exported > 0 && d.Exported > d.Imported ){
            ExpArr_ru.push(d);
        } else if (d.country === "Росія" && d.code != "TOTAL" && d.product != "All products" && d.Imported > 0 && d.Imported > d.Exported){
            ImpArr_ru.push(d);
        } else if (d.country === "ЄС" && d.code != "TOTAL" && d.product != "All products" && d.Imported > 0 && d.Imported > d.Exported){
            ImpArr_eu.push(d)
        } else if (d.country === "ЄС" && d.code != "TOTAL" && d.product != "All products" && d.Exported > 0 && d.Exported > d.Imported){
            ExpArr_eu.push(d)
        }
    });

    /* знаходимо максимальні значення для кожного з чотирьох блоків */
    var maxExp_ru = d3.max(ExpArr_ru, function(d) { return +d.Exported; } );
    var maxImp_ru = d3.max(ImpArr_ru, function(d) { return +d.Imported; } );
    var maxExp_eu = d3.max(ExpArr_eu, function(d) { return +d.Exported; } );
    var maxImp_eu = d3.max(ImpArr_eu, function(d) { return +d.Imported; } );


    /* малюємо дефолтну Росія */
    _.uniq(ImpArr_ru, "product").forEach(function(d){
        drawMultiples(myData, d.product, "Росія", "Imported", maxImp_ru);
    });

    _.uniq(ExpArr_ru, "product").forEach(function(d){
        drawMultiples(myData, d.product, "Росія", "Exported", maxExp_ru);
    });


    /* перемикач між країнами */
    $("#show-eu").on("click", function(d) {
        /* міняємо стиль кнопок */
        d3.select("#show-ru").style("background-color", "white").style("color", "grey");
        d3.select("#show-eu").style("background-color", "grey").style("color", "white");
        d3.select("#selected-country").html("Торгівля з ЄС, 2001-2018");

        /* малюємо графіки */
        d3.selectAll(".svg-wrapper").remove();

        _.uniq(ImpArr_eu, "product").forEach(function(d){
            drawMultiples(myData, d.product, "ЄС", "Imported", maxImp_eu);
        });

        _.uniq(ExpArr_eu, "product").forEach(function(d){
            drawMultiples(myData, d.product, "ЄС", "Exported", maxExp_eu);
        });

        drawGeneral(myData, "ЄС");

        /* якщо вже обраний експорт, то його і показуємо */
        if(showExport === true){
            d3.selectAll(".svg-wrapper.Exported").style("display", "block");
            d3.selectAll(".svg-wrapper.Imported").style("display", "none");
        }
    });


    /* Показати Росію */
    $("#show-ru").on("click", function(d) {
        d3.select("#show-eu").style("background-color", "white").style("color", "grey");
        d3.select("#show-ru").style("background-color", "grey").style("color", "white");
        d3.select("#selected-country").html("Торгівля з Росією, 2001-2018");
        
        d3.selectAll(".svg-wrapper").remove();

        _.uniq(ImpArr_ru, "product").forEach(function(d){
            drawMultiples(myData, d.product, "Росія", "Imported", maxImp_ru);
        });

        _.uniq(ExpArr_ru, "product").forEach(function(d){
            drawMultiples(myData, d.product, "Росія", "Exported", maxExp_ru);
        });


        drawGeneral(myData, "Росія");

        /* якщо вже обраний експорт, то його і показуємо */
        if(showExport === true){
            d3.selectAll(".svg-wrapper.Exported").style("display", "block");
            d3.selectAll(".svg-wrapper.Imported").style("display", "none");
        }
    });

    drawGeneral(myData, "Росія")
    
});




var drawMultiples = function(data, key, country, type, maxRange) {
    //d3.select('#line-chart > svg').remove();

    var testData =  data
        .filter(function (d) {
            return d.country === country && d.product === key;
        })
        .sort(function (a, b) {
            return b.year - a.year
        });

    /* максимальне значення саме цього графіку для перемальовки */
    var maxDataValue = d3.max(testData, function (d) { return Math.max(d.Exported, d.Imported);  });


    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var ySelf = d3.scaleLinear().range([height, 0]);

   // define the 1st line
    var valueline = d3.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d[type]);
        });

    var selfline = d3.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return ySelf(d[type]);
        });

    //linechartTest
    var svgContainer = d3.select("#line-chart")
        .append("div")
        .attr("class", "svg-wrapper "+ type)
        .style("width", '300px')
        .style("height", '200px')
        .on("mouseover", function(d) {
            $('.ghost').css("display", "none");
            $(this).find("svg").find('.ghost').css("display", "block")
        })
        .on("mouseleave", function(d) {
            $('.ghost').css("display", "none");
        });


    var svg = svgContainer.append("svg")
        .attr('width', '300px')
        .attr('height', '120px')
        .attr("data", maxDataValue)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    svgContainer
        .append("div")
        .attr("class", "svg-title")
        .style("width", '300px')
        .text(key);


    x.domain([new Date(2001, 0, 1), new Date(2018, 11, 31)]);
    ySelf.domain([0, d3.max(testData, function (d) { return Math.max(d.Exported, d.Imported);  })]);
    y.domain([0, maxRange]);

    var ghost = svg.append("g").attr("class", "ghost");

    // Єдина шкала
    svg.append("path")
        .data([testData])
        .attr("class", "valueline1")
        .style("stroke", type === "Exported" ? exColor : imColor)
        .attr("d", valueline);

    //Персональна шкала
    ghost.append("path")
        .data([testData])
        .attr("class", "self-line")
        .style("stroke", "grey")
        .style("stroke-dasharray", ("3, 3"))
        .style("fill", "none")
        .attr("d", selfline);


    ghost
        .selectAll('text')
        .data(testData)
        .enter()
        .append('text')
        .filter(function(d, i) { return i === 0 || i === (testData.length - 1) })
        .classed('label', true)
        .attr('x', function(d) {
                return x(d.year) - 15;
            })
        .attr("y", function(d) {
                return ySelf(d[type]) - 10;

        })
        .style("font-size", '10px')
        .style("fill", 'grey')
        .text(function(d){
            return Math.floor(d[type]/1000);
        })
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   
    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
};




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