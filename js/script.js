var parseDate = d3.timeParse("%d-%m-%Y");

var chart2_data;
function retrieve_chart_data(cb) {
    if (chart2_data) return cb(chart2_data);

    return d3.csv("data/data.csv", function(err, myData2){
        if (err) throw err;

        myData2.forEach(function (item) {
            item.categotyNumber = +item.categotyNumber;
            item.year = parseDate(item.year);
            item.Exported = +item.Exported  || 0;
            item.Imported = +item.Imported  || 0;
        });

        chart2_data = myData2;
        if (cb) return cb(myData2);
        return;
    })
}

retrieve_chart_data(function(myData2){

    var group = [];
    var subgroup = [];


    var productsList = myData2.map(function(item){
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
            
            drawLines(myData2, item.product);

        });

    li.sort(function(a, b) { return a.sort - b.sort });

    drawLines(myData2, "72 Iron and steel");

});


