var parseDate = d3.timeParse("%Y");

var chart_data;
function retrieve_chart_data(cb) {
    if (chart_data) return cb(chart_data);

    return d3.csv("data/data.csv", function(err, myData){
        if (err) throw err;

        myData.forEach(function (item) {
            item.year = parseDate(item.year);
            item.Exported = +item.Exported || 0;
            item.Imported = +item.Imported || 0;
        });

        chart_data = myData;
        if (cb) return cb(myData);
        return;
    })
}

retrieve_chart_data(function(myData){


    //create list of products
    var productsList = myData.map(function (d) {
        return d.product
    });

    productsList =  _.uniq(productsList);

    var list = d3.select("#my-list");

    var li = list.selectAll("li")
        .data(productsList)
        .enter()
        .append("li")
        .attr("class", "main-category plus")
        .text(function (d) {
            return d
        })
        .on("click", function (item) {
            $(this).toggleClass("plus minus");
            $(".main-category").css("color", "black");
            $(this).css("color", "red");
            $("ul.detail-category").addClass("hide");
            $(this).find("ul.detail-category").removeClass("hide");
            drawLines(myData, item);
            drawSankey(myData, item, "2017", "2018");

        });
        


    // li.each(function (d) {
    //     d3.select(this)
    //         .append("ul")
    //         .attr("class", "detail-category hide")
    //         .selectAll("li")
    //         .data(subgroup.filter(function (k) {
    //             return k.categotyNumber === d.categotyNumber
    //         }))
    //         .enter()
    //         .append("li")
    //         .attr("class", "detail-item")
    //         .text(function (k) {
    //             return k.product
    //         })
    //         .on("click", function(item){
    //             drawLines(item.product)
    //         })
    //         .on("mouseover", function (d) {
    //             $(this).css("color", "red");
    //         })
    //         .on("mouseleave", function (d) {
    //             $(this).css("color", "black")
    //         });
    // });
});



