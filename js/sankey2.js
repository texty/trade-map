/**
 * Created by yevheniia on 20.10.19.
 */
var drawSankey = function(data, selectedProduct, startYear, endYear) {

    //TODO оце треба витягувати на запит і вже з цим працювати
    var productData = data.filter(function (d) {
        if(startYear != endYear){
            return d.countries != "World" &&
                d.product === selectedProduct &&
                d.year >= parseDate(startYear) &&
                d.year <= parseDate(endYear);
        } else {
            return d.countries != "World" &&
                d.product === selectedProduct &&
                d.year === parseDate(startYear)
        }
    });



    /* Базова калькуляція, щоб приготувати дані до SANKEY -
     групуємо за країною та екпорт/імпорт та сумуємо показники за обраний період */
    var groups = _.groupBy(productData, 'countries', 'position');

    //exporters, sort, top5
    var exported = _.map(groups, function (value, key) {
        return {
            target: key + "-",
            value: _.reduce(value, function (total, o) {
                return total + o.Exported;
            }, 0),
            source: "Ukraine"
        };
    })
        .sort(function (a, b) {
            return b.value - a.value
        })
        .slice(0, 5);



    //importers, sort, top5
    var imported = _.map(groups, function (value, key) {
        return {
            target: "Ukraine",
            value: _.reduce(value, function (total, o) {
                return total + o.Imported;
            }, 0),
            source: key
        };
    })
        .sort(function (a, b) {
            return b.value - a.value
        })
        .slice(0, 5);

    //обʼєднуємо в дані
    console.log(exported);
    console.log(imported);

    var preparedData = imported.concat(exported);


    var graphData = {"nodes": [], "links": []};

    preparedData.forEach(function (d) {
        graphData.nodes.push({"name": d.source});
        graphData.nodes.push({"name": d.target});
        graphData.links.push({
            "source": d.source,
            "target": d.target,
            "value": +d.value
        });
    });

    graphData.nodes = d3.keys(d3.nest()
        .key(function (d) {
            return d.name;
        })
        .object(graphData.nodes));

    // loop through each link replacing the text with its index from node
    graphData.links.forEach(function (d, i) {
        graphData.links[i].source = graphData.nodes.indexOf(graphData.links[i].source);
        graphData.links[i].target = graphData.nodes.indexOf(graphData.links[i].target);
    });

    // now loop through each nodes to make nodes an array of objects
    // rather than an array of strings
    graphData.nodes.forEach(function (d, i) {
        graphData.nodes[i] = {"name": d};
    });

    //малюємо
    d3.select('#sankey > svg').remove();


    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 700 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var svg = d3.select("#sankey").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    var formatNumber = d3.format(",.0f"),
        format = function(d) { return formatNumber(d) + " тис. доларів"; },
        color = d3.scaleOrdinal(d3.schemeCategory10);

    var sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .size([width, height]);

    var link = svg.append("g")
        .attr("class", "links")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.2)
        .selectAll("path");

    var node = svg.append("g")
        .attr("class", "nodes")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .selectAll("g");

    var graph = sankey(graphData);

    link = link
        .data(graphData.links)
        .enter().append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", function(d) { return Math.max(1, d.width); });

    link.append("title")
        .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

    node = node
        .data(graphData.nodes)
        .enter().append("g");


    node.append("rect")
        .attr("x", function(d) { return d.x0; })
        .attr("y", function(d) { return d.y0; })
        .attr("height", function(d) { return d.y1 - d.y0; })
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("fill", function(d) { return color(d.name.replace(/ .*/, "")); })
        .attr("stroke", "#000");

    node.append("text")
        .attr("x", function(d) { return d.x0 - 6; })
        .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(function(d) { return d.name; })
        .filter(function(d) { return d.x0 < width / 2; })
        .attr("x", function(d) { return d.x1 + 6; })
        .attr("text-anchor", "start");

    node.append("title")
        .text(function(d) { return d.name + "\n" + format(d.value); });


}
