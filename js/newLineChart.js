/**
 * Created by yevheniia on 18.11.19.
 */
var margin = {top: 10, right: 20, bottom: 15, left: 20},
    width = 300 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom,
    rectWidth = 5;



retrieve_chart_data(function(myData){
    var ExpArr_ru = [];
    var ImpArr_ru = [];
    var ExpArr_eu = [];
    var ImpArr_eu = [];
    var ExpArr_all = [];
    var ImpArr_all = [];
    var ExpArr_cases = [];
    var ImpArr_cases = [];
    var ExpArr_usa = [];
    var ImpArr_usa = [];
    var ExpArr_asia = [];
    var ImpArr_asia = [];
    var ExpArr_africa = [];
    var ImpArr_africa = [];


    myData.forEach(function(d) {
        if(d.country === "Росія" && d.code != "TOTAL" && d.product != "All products" && d.Exported > 0 && d.Exported > d.Imported ){
            ExpArr_ru.push(d);
        } else if (d.country === "Росія" && d.code != "TOTAL" && d.product != "All products" && d.Imported > 0 && d.Imported > d.Exported){
            ImpArr_ru.push(d);
        } else if (d.country === "ЄС" && d.code != "TOTAL" && d.product != "All products" && d.Imported > 0 && d.Imported > d.Exported){
            ImpArr_eu.push(d)
        } else if (d.country === "ЄС" && d.code != "TOTAL" && d.product != "All products" && d.Exported > 0 && d.Exported > d.Imported){
            ExpArr_eu.push(d)
        } else if (d.country === "загалом" && d.code != "TOTAL" && d.product != "All products" && d.Imported > 0 && d.Imported > d.Exported){
            ImpArr_all.push(d)
        } else if (d.country === "загалом" && d.code != "TOTAL" && d.product != "All products" && d.Exported > 0 && d.Exported > d.Imported){
            ExpArr_all.push(d)
        } else if (d.country === "cases" && d.Imported > 0 && d.Imported > d.Exported){
            ImpArr_cases.push(d)
        } else if (d.country === "cases" && d.Exported > 0 && d.Exported > d.Imported){
            ExpArr_cases.push(d)
        } else if (d.country === "Азія" && d.code != "TOTAL" && d.product != "All products" && d.Imported > 0 && d.Imported > d.Exported){
            ImpArr_asia.push(d)
        } else if (d.country === "Азія" && d.code != "TOTAL" && d.product != "All products" && d.Exported > 0 && d.Exported > d.Imported){
            ExpArr_asia.push(d)
        } else if (d.country === "Африка" && d.code != "TOTAL" && d.product != "All products" && d.Imported > 0 && d.Imported > d.Exported){
            ImpArr_africa.push(d)
        } else if (d.country === "Африка" && d.code != "TOTAL" && d.product != "All products" && d.Exported > 0 && d.Exported > d.Imported){
            ExpArr_africa.push(d)
        } else if (d.country === "США" && d.code != "TOTAL" && d.product != "All products" && d.Imported > 0 && d.Imported > d.Exported){
            ImpArr_usa.push(d)
        } else if (d.country === "США" && d.code != "TOTAL" && d.product != "All products" && d.Exported > 0 && d.Exported > d.Imported){
            ExpArr_usa.push(d)
        }
    });

    /* знаходимо максимальні значення для кожного з чотирьох блоків */
    var maxExp_ru = d3.max(ExpArr_ru, function(d) { return +d.Exported; } );
    var maxImp_ru = d3.max(ImpArr_ru, function(d) { return +d.Imported; } );
    var maxExp_eu = d3.max(ExpArr_eu, function(d) { return +d.Exported; } );
    var maxImp_eu = d3.max(ImpArr_eu, function(d) { return +d.Imported; } );
    var maxExp_all = d3.max(ExpArr_all, function(d) { return +d.Exported; } );
    var maxImp_all = d3.max(ImpArr_all, function(d) { return +d.Imported; } );

    var maxExp_cases = d3.max(ExpArr_cases, function(d) { return +d.Exported; } );
    var maxImp_cases = d3.max(ImpArr_cases, function(d) { return +d.Imported; } );

    var maxExp_asia = d3.max(ExpArr_asia, function(d) { return +d.Exported; } );
    var maxImp_asia = d3.max(ImpArr_asia, function(d) { return +d.Imported; } );
    var maxExp_africa = d3.max(ExpArr_africa, function(d) { return +d.Exported; } );
    var maxImp_africa = d3.max(ImpArr_africa, function(d) { return +d.Imported; } );
    var maxExp_usa = d3.max(ExpArr_usa, function(d) { return +d.Exported; } );
    var maxImp_usa = d3.max(ImpArr_usa, function(d) { return +d.Imported; } );


    /* малюємо дефолтнe ЗАГАЛОМ */
    _.uniq(ImpArr_all, "product").forEach(function(d){
        drawMultiples(myData, d.product, "загалом", "Imported", maxImp_all, "#line-chart");
    });

    _.uniq(ExpArr_all, "product").forEach(function(d){
        drawMultiples(myData, d.product, "загалом", "Exported", maxExp_all, "#line-chart");
    });


    /* малюємо дефолтні цікаві випадки */
    _.uniq(ImpArr_cases, "product").forEach(function(d){
        drawMultiples(myData, d.product, "cases", "Imported", maxImp_cases, "#cases-chart");
    });

    _.uniq(ExpArr_cases, "product").forEach(function(d){
        drawMultiples(myData, d.product, "cases", "Exported", maxExp_cases, "#cases-chart");
    });


    /* перемикач між країнами */
    //Загалом
    $("#show-all").on("click", function(d) {
        /* міняємо стиль кнопок */
        d3.selectAll("#show-ru, #show-eu, #show-asia, #show-africa, #show-usa").style("background-color", "white").style("color", "grey");
        d3.select("#show-all").style("background-color", "grey").style("color", "white");
        d3.select("#selected-country").html("Торгівля зі світом, 2001-2018");

        /* малюємо графіки */
        d3.selectAll("#line-chart >.svg-wrapper").remove();

        _.uniq(ImpArr_all, "product").forEach(function(d){
            drawMultiples(myData, d.product, "загалом", "Imported", maxImp_all, "#line-chart");
        });

        _.uniq(ExpArr_all, "product").forEach(function(d){
            drawMultiples(myData, d.product, "загалом", "Exported", maxExp_all, "#line-chart");
        });
        
        selectedCountry =  "загалом";

        // drawGeneral(myData, "#general-import", "загалом", "Imported");
        // drawGeneral(myData, "#general-export", "загалом", "Exported");

        /* якщо вже обраний експорт, то його і показуємо */
        if(showExport === true){
            d3.selectAll(".svg-wrapper.Exported").style("display", "block");
            d3.selectAll(".svg-wrapper.Imported").style("display", "none");
        }
    });
    
    //Показати Європу
    $("#show-eu").on("click", function(d) {
        /* міняємо стиль кнопок */
        d3.selectAll("#show-ru, #show-all, #show-asia, #show-africa, #show-usa").style("background-color", "white").style("color", "grey");
        d3.select("#show-eu").style("background-color", "grey").style("color", "white");
        d3.select("#selected-country").html("Торгівля з ЄС, 2001-2018");

        /* малюємо графіки */
        d3.selectAll("#line-chart >.svg-wrapper").remove();

        _.uniq(ImpArr_eu, "product").forEach(function(d){
            drawMultiples(myData, d.product, "ЄС", "Imported", maxImp_eu, "#line-chart");
        });

        _.uniq(ExpArr_eu, "product").forEach(function(d){
            drawMultiples(myData, d.product, "ЄС", "Exported", maxExp_eu, "#line-chart");
        });

        selectedCountry =  "ЄС";
        // drawGeneral(myData, "#general-import", "ЄС", "Imported");
        // drawGeneral(myData, "#general-export", "ЄС", "Exported");


        /* якщо вже обраний експорт, то його і показуємо */
        if(showExport === true){
            d3.selectAll(".svg-wrapper.Exported").style("display", "block");
            d3.selectAll(".svg-wrapper.Imported").style("display", "none");
        }
    });


    /* Показати Росію */
    $("#show-ru").on("click", function(d) {
        d3.selectAll("#show-eu, #show-all, #show-asia, #show-africa, #show-usa").style("background-color", "white").style("color", "grey");
        d3.select("#show-ru").style("background-color", "grey").style("color", "white");
        d3.select("#selected-country").html("Торгівля з Росією, 2001-2018");
        
        d3.selectAll("#line-chart >.svg-wrapper").remove();

        _.uniq(ImpArr_ru, "product").forEach(function(d){
            drawMultiples(myData, d.product, "Росія", "Imported", maxImp_ru, "#line-chart");
        });

        _.uniq(ExpArr_ru, "product").forEach(function(d){
            drawMultiples(myData, d.product, "Росія", "Exported", maxExp_ru, "#line-chart");
        });

        selectedCountry =  "Росія";
        // drawGeneral(myData, "#general-import", "Росія", "Imported");
        // drawGeneral(myData, "#general-export", "Росія", "Exported");

        /* якщо вже обраний експорт, то його і показуємо */
        if(showExport === true){
            d3.selectAll(".svg-wrapper.Exported").style("display", "block");
            d3.selectAll(".svg-wrapper.Imported").style("display", "none");
        }
    });


    $("#show-asia").on("click", function(d) {
        d3.selectAll("#show-eu, #show-all, #show-ru, #show-africa, #show-usa").style("background-color", "white").style("color", "grey");
        d3.select("#show-asia").style("background-color", "grey").style("color", "white");
        d3.select("#selected-country").html("Торгівля з Азією, 2001-2018");

        d3.selectAll("#line-chart >.svg-wrapper").remove();

        _.uniq(ImpArr_asia, "product").forEach(function(d){
            drawMultiples(myData, d.product, "Азія", "Imported", maxImp_asia, "#line-chart");
        });

        _.uniq(ExpArr_asia, "product").forEach(function(d){
            drawMultiples(myData, d.product, "Азія", "Exported", maxExp_asia, "#line-chart");
        });

        selectedCountry =  "Азія";
        // drawGeneral(myData, "#general-import", "Азія", "Imported");
        // drawGeneral(myData, "#general-export", "Азія", "Exported");


        /* якщо вже обраний експорт, то його і показуємо */
        if(showExport === true){
            d3.selectAll(".svg-wrapper.Exported").style("display", "block");
            d3.selectAll(".svg-wrapper.Imported").style("display", "none");
        }
    });

    $("#show-africa").on("click", function(d) {
        d3.selectAll("#show-eu, #show-all, #show-ru, #show-asia, #show-usa").style("background-color", "white").style("color", "grey");
        d3.select("#show-africa").style("background-color", "grey").style("color", "white");
        d3.select("#selected-country").html("Торгівля з Африкою, 2001-2018");

        d3.selectAll("#line-chart >.svg-wrapper").remove();

        _.uniq(ImpArr_africa, "product").forEach(function(d){
            drawMultiples(myData, d.product, "Африка", "Imported", maxImp_africa, "#line-chart");
        });

        _.uniq(ExpArr_africa, "product").forEach(function(d){
            drawMultiples(myData, d.product, "Африка", "Exported", maxExp_africa, "#line-chart");
        });

        selectedCountry =  "Африка";
        // drawGeneral(myData, "#general-import", "Африка", "Imported");
        // drawGeneral(myData, "#general-export", "Африка", "Exported");

        /* якщо вже обраний експорт, то його і показуємо */
        if(showExport === true){
            d3.selectAll(".svg-wrapper.Exported").style("display", "block");
            d3.selectAll(".svg-wrapper.Imported").style("display", "none");
        }
    });

    $("#show-usa").on("click", function(d) {
        d3.selectAll("#show-eu, #show-all, #show-ru, #show-asia, #show-africa").style("background-color", "white").style("color", "grey");
        d3.select("#show-usa").style("background-color", "grey").style("color", "white");
        d3.select("#selected-country").html("Торгівля із США, 2001-2018");

        d3.selectAll("#line-chart >.svg-wrapper").remove();

        _.uniq(ImpArr_usa, "product").forEach(function(d){
            drawMultiples(myData, d.product, "США", "Imported", maxImp_usa, "#line-chart");
        });

        _.uniq(ExpArr_usa, "product").forEach(function(d){
            drawMultiples(myData, d.product, "США", "Exported", maxExp_usa, "#line-chart");
        });

        selectedCountry =  "США";
        // drawGeneral(myData, "#general-import", "США", "Imported");
        // drawGeneral(myData, "#general-export", "США", "Exported");


        /* якщо вже обраний експорт, то його і показуємо */
        if(showExport === true){
            d3.selectAll(".svg-wrapper.Exported").style("display", "block");
            d3.selectAll(".svg-wrapper.Imported").style("display", "none");
        }
    });

    drawMain();
    // drawGeneral(myData, "#general-import", "загалом", "Imported");
    // drawGeneral(myData, "#general-export", "загалом", "Exported");
    
});




var drawMultiples = function(data, key, country, type, maxRange, container) {
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
    var svgContainer = d3.select(container)
        .append("div")
        .attr("class", "svg-wrapper "+ type)
        .style("width", '300px')
        .style("height", '200px')
        // .on("mouseover", function(d) {
        //     $('.ghost').css("display", "none");
        //     $(this).find("svg").find('.ghost').css("display", "block")
        // })
        // .on("mouseleave", function(d) {
        //     $('.ghost').css("display", "none");
        // })
        ;


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