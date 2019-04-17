
var width2 = 960,
    height2 = 500;

var projection = d3.geo.mercator()
    .center([0, 5 ])
    .scale(150)
    .rotate([-180,0]);

var svg3 = d3.select("#map").append("svg")
    .attr("width", width2)
    .attr("height", height2);

var gpath = d3.geo.path()
    .projection(projection);

var map = svg3.append("g");

// queue()
//     .defer(d3.csv, 'data/world-110m2.json.txt')
//     .defer(d3.csv, 'data/year_loc_freq')
//     .await(makeMyMap);

// function makeMyMap(error, countries, cities) {
//     svg3.append('path')
//         .datum(topojson.object(countries, countries.objects.usStates))
//         .attr('d', path)
//         .attr('class', 'states');
//     svg3.selectAll('.cities')
//         .data(cities.features)
//         .enter()
//         .append('path')
//         .attr('d', path.pointRadius(5))
//         .attr('class', 'cities');
// }

// load and display the World
d3.json("data/world-110m2.json", function(error, topology) {
    map.selectAll("path")
        .data(topojson.object(topology, topology.objects.countries)
            .geometries)
        .enter()
        .append("path")
        .attr("d", gpath)
        // .attr("fill", "blue")

    //load and display the location
    d3.csv("data/year_loc_freq.csv", function(error, data) {
        //append circle to each location on the map
        map.selectAll("circle")
            .data(data)
            .enter()
            // .attr("xlink")
            .append("circle")
            .attr("cx", function(d) {
                return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function(d) {
                return projection([d.lon, d.lat])[1];
            })
            .attr("r", 5)
            .style("fill", "brown")
            .on("mouseover", );

        // append text to each circle
        map.selectAll("text")
            .data(data)
            .enter()
            .append("text") // append text
            .attr("x", function(d) {
                return projection([d.lon, d.lat])[0];
            })
            .attr("y", function(d) {
                return projection([d.lon, d.lat])[1];
            })
            .attr("dy", -7) // set y position of bottom of text
            .style("fill", "black") // fill the text with the colour black
            .attr("text-anchor", "middle") // set anchor y justification
            .text(function(d) {return d.location;}); // define the text to display
    });

    map.selectAll("path")
        .data(topojson.object(topology, topology.objects.countries)
            .geometries)
        .enter()
        .append("path")
        .attr("d", gpath)


});

var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        map.attr("transform","translate("+
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        map.selectAll("path")
            .attr("d", gpath.projection(projection));
    });
svg3.call(zoom)