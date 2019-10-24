var svg = d3.select("svg#map")
    .attr( 'preserveAspectRatio',"xMinYMin meet")
    .attr("viewBox", "0 0 900 600")
    .attr('width', '100%');

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
    .scale(150)
    .center([0,20])
    .translate([900 / 2, 600 / 2]);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
    .domain([0, 5000, 10000, 50000, 100000, 500000, 1000000])
    .range(d3.schemeReds[7]);



d3.json("data/trade-map.geojson",  function(topo) {

    // var topoExported = topo.filter(function(item){
    //     return item["trade position"] === "Exported";
    // });
    // console.log(topo);

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", function (d) {
            return colorScale(d.properties["trade_2013"]);
        });
});

