function drawMap(geodata, container, key) {

    var svg = d3.select(container)
        .attr( 'preserveAspectRatio',"xMinYMin meet")
        .attr("viewBox", "0 0 900 550")
        .attr('width', '100%');

// Map and projection
    var path = d3.geoPath();
    
    var projection = d3.geoMercator()
        .scale(150)
        .center([0,20])
        .translate([900 / 2, 550 / 2]);


    var min = d3.min(geodata, function(d){return d.properties[key];}),
            max= d3.max(geodata, function(d){return d.properties[key]});

    var color = d3.scaleThreshold()
            .domain([min, 1000, 50000, 500000, max/6, max/4, max/2, max/1.5, max])
            .range(d3.schemeOranges[8]);

    // Draw the map
    svg.append("g")
       .selectAll("path")
       .data(geodata)
       .enter()
       .append("path")
       .attr("class", 'tippy')
       .attr("d", d3.geoPath()
             .projection(projection)
       )
        .attr("data-tippy-content", function(d) {
            console.log(d);
            return d.properties["ua_country_uk"] + " - " + d.properties[key] + " тис. доларів"
        })
       .attr("fill", function (d) {
            return color(d.properties[key]);
       })
       .on("click", function(d){           
           
       });

    tippy('.tippy', {
        delay: 0,
        arrow: true,
        arrowType: 'round',
        size: 'small',
        duration: 500
    });


}


