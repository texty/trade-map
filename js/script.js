var parseDate = d3.timeParse("%d-%m-%Y");

var chart_data;
function retrieve_chart_data(cb) {
    if (chart_data) return cb(chart_data);

    return d3.csv("data/data.csv", function(err, myData){
        if (err) throw err;

        myData.forEach(function (item) {
            item.categotyNumber = +item.categotyNumber;
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

    var group = [];
    var subgroup = [];


    var productsList = myData.map(function(item){
        return {
            "category": item.category,
            "categoryNumber": +item.categotyNumber,
            "product": item.product,
            "sort": +item.sort
        }
    });

    productsList = _.uniq(productsList, "product");



    var list = d3.select("#my-list");


    var li = list.selectAll("li")
        .data(productsList)
        .enter()
        .append("li")
        .attr("class", function(d){
            if(d.category === "group"){
                return "main" + " c" + d.categoryNumber
            } else {
                return "subgroup" + " c" + d.categoryNumber
            }
        })
        .text(function (d) {
            return d.product
        })
        .on("click", function (item) {

            $("li").css("text-decoration", "none");

            $(this).css("text-decoration", "underline");

            
            if($(this).hasClass("main")){
                $("li").removeClass("clicked");
                var classNumber = $(this).attr('class').split(/\s+/);
                $("li.subgroup").css("display", "none");
                $("li." + classNumber[1]).css("display", "block");
            }

            if(item.categoryNumber < 11) {
                $(this).addClass("clicked");
            }
            
            drawLines(myData, item.product);

        });


    li.sort(function(a, b) { return a.sort - b.sort });

    drawLines(myData, "72 Iron and steel");

});




//карти
d3.json("data/trade-map.geojson",  function(topo) {
    topo.features.forEach(function (d) {
        d.properties["ua_exported_to"] = +d.properties["ua_exported_to"] || 0;
        d.properties["ua_imported_from"] = +d.properties["ua_imported_from"] || 0;
    });


    drawMap(topo.features, "svg#import-map", "ua_01_18_imported_from", d3.schemePuBu);
    drawMap(topo.features, "svg#export-map", "ua_01_18_exported_to", d3.schemeRdPu);

    tippy('.tippy', {
        delay: 0,
        arrow: true,
        arrowType: 'round',
        size: 'small',
        duration: 500
    });

    
});


//спарклайни
d3.json("data/top_5.json", function(top) {

    top.forEach(function(d){
        d.data.forEach(function(nest){
            nest.thous = +nest.thous;
            nest.year = parseDate(nest.year);

        })
    });

    var tBody = d3.select("#export-top")
        .append("tbody");

    var rows = tBody.selectAll('tr')
        .data(top.filter(function(d){ return d.position === "exported"}))
        .enter()
        .append('tr');

    rows.append('td')
        .text(function (d) {
            return d.product;
        });
    
    rows.append('td')
        .datum(function (d) {
            return d.data;
        })
        .call(spark(exColor));


    var tBody2 = d3.select("#import-top")
        .append("tbody");

    var rows2 = tBody2.selectAll('tr')
        .data(top.filter(function(d){ return d.position === "imported"}))
        .enter()
        .append('tr');

    rows2.append('td')
        .text(function (d) {
            return d.product;
        });

    rows2.append('td')
        .datum(function (d) {
            return d.data;
        })
        .call(spark(imColor));
});




