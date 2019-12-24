/**
 * Created by yevheniia on 18.11.19.
 */
var margin = {top: 10, right: 20, bottom: 15, left: 20},
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

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

    // /* знаходимо максимальні значення для початкових  блоків */
    var maxExp_all = d3.max(ExpArr_all, function(d) { return +d.Exported; } );
    var maxImp_all = d3.max(ImpArr_all, function(d) { return +d.Imported; } );
    var maxExp_cases = d3.max(ExpArr_cases, function(d) { return +d.Exported; } );
    var maxImp_cases = d3.max(ImpArr_cases, function(d) { return +d.Imported; } );


    const correspondings = [
        {country: "загалом", type: "Imported", data: ImpArr_all, button: "show-all", text: "зі світом" },
        {country: "загалом", type: "Exported", data: ExpArr_all, button: "show-all", text: "зі світом"  },
        {country: "ЄС", type: "Imported", data: ImpArr_eu, button: "show-eu", text: "з Європейським Союзом"  },
        {country: "ЄС", type: "Exported", data: ExpArr_eu, button: "show-eu", text: "з Європейським Союзом"  },
        {country: "Росія", type: "Imported", data: ImpArr_ru, button: "show-ru", text: "з Росією"  },
        {country: "Росія", type: "Exported", data: ExpArr_ru, button: "show-ru", text: "з Росією"  },
        {country: "Азія", type: "Imported", data: ImpArr_asia, button: "show-asia", text: "з Азією"  },
        {country: "Азія", type: "Exported", data: ExpArr_asia, button: "show-asia", text: "з Азією"  },
        {country: "Африка", type: "Imported", data: ImpArr_africa, button: "show-africa", text: "з Африкою"  },
        {country: "Африка", type: "Exported", data: ExpArr_africa, button: "show-africa", text: "з Африкою"  },
        {country: "США", type: "Imported", data: ImpArr_usa, button: "show-usa", text: "із США"  },
        {country: "США", type: "Exported", data: ExpArr_usa, button: "show-usa", text: "із США"  }
    ];

    /* малюємо дефолтнe ЗАГАЛОМ */
    _.uniq(ImpArr_all, "product").forEach(function(d){
        drawMultiples(myData, d.product, "загалом", "Imported", maxImp_all, "#line-chart");
        // $(".svg-wrapper.Exported").appendTo(".exported-top");
        // $(".svg-wrapper.Imported").appendTo(".imported-top");


        $('#line-chart').find('.svg-wrapper.Imported').sort(function (a, b) {
            return $(b).attr('data') - $(a).attr('data');
        }).appendTo('#line-chart');

    });

    _.uniq(ExpArr_all, "product").forEach(function(d){
        drawMultiples(myData, d.product, "загалом", "Exported", maxExp_all, "#line-chart");

        $('#line-chart').find('.svg-wrapper.Exported').sort(function (a, b) {
            return $(b).attr('data') - $(a).attr('data');
        }).appendTo('#line-chart');
    });


    /* малюємо дефолтні цікаві випадки */
    _.uniq(ImpArr_cases, "product").forEach(function(d){
        drawMultiples(myData, d.product, "cases", "Imported", maxImp_cases, "#cases-chart");
    });

    $('#cases-chart').find('.svg-wrapper.Imported').sort(function (a, b) {
        return $(b).attr('data') - $(a).attr('data');
    }).appendTo('#cases-chart');

    _.uniq(ExpArr_cases, "product").forEach(function(d){
        drawMultiples(myData, d.product, "cases", "Exported", maxExp_cases, "#cases-chart");
    });

    $('#cases-chart').find('.svg-wrapper.Exported').sort(function (a, b) {
        return $(b).attr('data') - $(a).attr('data');
    }).appendTo('#cases-chart');



    $(".changeCountry").on("click", function(){
        d3.selectAll(".changeCountry").style("background-color", "white").style("color", "grey");
        d3.select(this).style("background-color", "grey").style("color", "white");
        selectedCountry = $(this).attr("data");
        var targetArray = correspondings.filter(function(d){ return d.country === selectedCountry });

        d3.selectAll("#line-chart >.svg-wrapper").remove();
        d3.selectAll(".exported-top >.svg-wrapper").remove();
        d3.selectAll(".imported-top >.svg-wrapper").remove();

        targetArray.forEach(function(d){
            _.uniq(d.data, "product").forEach(function(k){
                drawMultiples(myData, k.product, k.country, d.type, d3.max(d.data, function(p) { return p[d.type];}), "#line-chart");
            });

        });

        $('#line-chart').find('.svg-wrapper.Imported').sort(function (a, b) {
            return $(b).attr('data') - $(a).attr('data');
        }).appendTo('#line-chart');
        $('#line-chart').find('.svg-wrapper.Exported').sort(function (a, b) {
            return $(b).attr('data') - $(a).attr('data');
        }).appendTo('#line-chart');


        d3.select("#selected-country").html("Торгівля " + targetArray[1].text +", 2001-2018");

        if(showExport === true){
            d3.selectAll(".svg-wrapper.Exported").style("display", "block");
            d3.selectAll(".svg-wrapper.Imported").style("display", "none");
        }
    });
    

    $('select').on('change', function() {
        selectedCountry = this.value;
        d3.selectAll("#line-chart >.svg-wrapper").remove();
        var targetArray = correspondings.filter(function(d){ return d.country === selectedCountry });

        targetArray.forEach(function(d){
            _.uniq(d.data, "product").forEach(function(k){
                drawMultiples(myData, k.product, k.country, d.type, d3.max(d.data, function(p) { return p[d.type];}), "#line-chart");
            });

        });

        $('#line-chart').find('.svg-wrapper.Imported').sort(function (a, b) {
            return $(b).attr('data') - $(a).attr('data');
        }).appendTo('#line-chart');
        $('#line-chart').find('.svg-wrapper.Exported').sort(function (a, b) {
            return $(b).attr('data') - $(a).attr('data');
        }).appendTo('#line-chart');

        d3.select("#selected-country").html("Торгівля" + targetArray[1].text +", 2001-2018");

        if(showExport === true){
            d3.selectAll(".svg-wrapper.Exported").style("display", "block");
            d3.selectAll(".svg-wrapper.Imported").style("display", "none");
        }
    });


    drawMain();
    
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

    console.log(testData);

    /* максимальне значення саме цього графіку для перемальовки */
    var maxDataValue = d3.max(testData, function (d) { return Math.max(d[type]);  });


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
        .attr("class", "svg-wrapper " + type)
        .style("width", '300px')
        .style("height", 'max-content')
        .attr("data", maxDataValue);


    var svg = svgContainer.append("svg")
        .attr('width', '300px')
        .attr('height', 50 + (maxDataValue/(maxRange/300)) + "px")
        .attr("data", maxDataValue)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + -((250 - maxDataValue/(maxRange/300))+ margin.top) + ")");

    svgContainer
        .append("div")
        .attr("class", "svg-title")
        .style("width", '300px')
        .text(function() {
            if(key.length <= 40) {
                return key
            } else {
                return key.substring(0,40) + " ..."
            }

        })
        .attr("data-tippy-content", key);

    tippy('.svg-title', {
        content: '',
        arrow: false

    });

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
    // ghost.append("path")
    //     .data([testData])
    //     .attr("class", "self-line")
    //     .style("stroke", "grey")
    //     .style("stroke-dasharray", ("3, 3"))
    //     .style("fill", "none")
    //     .attr("d", selfline);


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
                return y(d[type]) - 10;

        })
        .style("font-size", '10px')
        .style("fill", 'black')
        .text(function(d){
            return Math.floor(d[type]/1000);
        })
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   
    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(-height));

    svg.selectAll(".tick > line")
        .attr("stroke", "lightgrey")


};



