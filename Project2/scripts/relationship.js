
var units = "Widgets";

// set the canvas
var margin1 = {top: 10, right: 10, bottom: 10, left: 10},
    width1 = 1000 - margin.left - margin.right,
    height1 = 900 - margin.top - margin.bottom;
//
// width1 = 800;
// height1 = 600
var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; };

// set the scales
var color1 = d3.scale.category20();
var linkScale = d3.scale.linear()
    .range([0.25, 1.0]);

// append svg canvas to the page
var svg2 = d3.select("#graph").append("svg")
    // .attr("width", width1 + margin1.left + margin1.right)
    // .attr("height", height1 + margin1.top + margin1.bottom)
    .attr("width", width1 + 300)
    .attr("height", height1)
    .append("g")
    .attr("transform",
        "translate(" + margin1.left  + "," + margin1.top + ")");

var data1;

d3.csv("data/test.csv",function(error,data){
    data1 = data;
    //set up an empty graph
    graph = {"nodes" : [], "links" : []};

    //get the headers for the data
    var keys = Object.keys(data[0]);


    // graph = {"nodes" : [], "links" : []};
    // data.forEach(function(d){
    //     adduniquenodes(d.name);
    //     adduniquenodes(d.team);
    //     adduniquenodes(d.sport);
    //     adduniquenodes(d.event);
    //     adduniquenodes(d.city);
    //     adduniquenodes(d.year);
        // graph.links.push ( {"source" : d.name,
        //     "target" :d.team,
        //     "value" : countvalues('name',d.name,'team',d.team)
        // });
        //
        // graph.links.push ( {"source" : d.team,
        //     "target" :d.name,
        //     "value" : countvalues('team',d.team,'name',d.name)
        // });
        // graph.links.push ( {"source" : d.team,
        //     "target" :d.sport,
        //     "value" : countvalues('team',d.team,'sport',d.sport)
        // });
    //     graph.links.push ( {"source" : d.sport,
    //         "target" :d.event,
    //         "value" : countvalues('sport',d.sport,'event',d.event)
    //     });
    // });




    // process the data to create nodes and links

    data.forEach(function(d) {
        keys.forEach(function (key, i) {
            if (d[key] != "none") {
                adduniquenodes(d[key]);
            } //add node if not "none"
            var c = 1; //checks next column
            if (d[keys[i + c]] != undefined && d[key] !== "none") {
                while (d[keys[i + c]] === "none") {
                    c = c + 1;     //jump to next column if "none" found in the column next
                }
                graph.links.push({
                    "source": d[key],
                    "target": d[keys[i + c]],
                    "value": countvalues(key, d[key], keys[i + c], d[keys[i + c]])
                });
            }
        })
    });
        debugger
        function adduniquenodes(value) {
            if (graph.nodes.indexOf(value) === -1){
            //     if (graph.nodes.value > 10){
                    graph.nodes.push(value);
            }
        }

        function countvalues (sourcekey, source, targetkey, target) {
            var c = 0;
            data.forEach (function (d){
                if (d[sourcekey] === source && d[targetkey]===target){
                    c++;
                }

            });
            return c;
        }
    console.log(graph);

    // loop through each link replacing the text with its index from node
        graph.links.forEach(function (d, i) {
            graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
            graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
        });

        //now loop through each nodes to make nodes an array of objects
        // rather than an array of strings
        graph.nodes.forEach(function (d, i) {
            graph.nodes[i] = { "name": d };
        });
        // graph.links.filter(d=>d.value === true);

debugger



    linkScale.domain(d3.extent(graph, function (d) {
        return d.value;
    }));

    var force = d3.layout.force()
        .nodes(graph.nodes)
        .links(graph.links)
        .size([width1, height1])
        .linkDistance(60)
        .charge(-300)
        .on("tick", tick)
        .start();

    svg2.append("svg:defs").selectAll('marker')
        .data(['end'])
        .enter()
        .append("svg:marker")
        .attr('id', function (d) {
            return d;
        })
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 15)
        .attr('refY', -1.5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr("d", "M0,-5L10,0L0,5");

    var path = svg2.append("svg:g").selectAll("path")
        .data(force.links())
        .enter()
        .append("svg:path")
        // .filter(d=>d.weight > 10)
        .classed("link", true)
        .attr("marker-end", "url(#end)");

    var node = svg2.selectAll(".node")
        .data(force.nodes())
        .enter()
        .append("g")
        .classed("node", true)
        .on("click", click)
        .on("dblclick", dblclick)
        .call(force.drag());
        // .on("dblclick", connectedNodes());

    node.append("circle")
        .attr("r", 5)
        .style("fill", function (d) {
            return color1(d.name)
        });


    node.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.name;
        });

    function tick() {
        path.attr("d", function (d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);

            return "M" +
                d.source.x + "," + d.source.y +
                "A" + dr + "," + dr + " 0 0,1 " +
                d.target.x + "," + d.target.y;
        }).style("opacity", function (d) {
            return linkScale(d.value);
        });

        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    }

    function click() {
        d3.select(this).select("text").transition()
            .duration(750)
            .attr("x", 22)
            .style("fill", "steelblue")
            .style("stroke", "lightsteelblue")
            .style("stroke-width", ".5px")
            .style("font", "20px sans-serif");

        d3.select(this).select("circle").transition()
            .duration(750)
            .attr("r", 16);
    }

    function dblclick() {
        d3.select(this).select("text").transition()
            .duration(750)
            .attr("x", 12)
            .style("fill", "black")
            .style("stroke", "none")
            .style("stroke-width", "none")
            .style("font", "10px sans-serif");

        d3.select(this).select("circle").transition()
            .duration(750)
            .attr("r", 6);
    }


// //Toggle stores whether the highlighting is on
//     var toggle = 0;
// //Create an array logging what is connected to what
//     var linkedByIndex = {};
//     for (i = 0; i < graph.nodes.length; i++) {
//         linkedByIndex[i + "," + i] = 1;
//     };
//     graph.links.forEach(function (d) {
//         linkedByIndex[d.source.index + "," + d.target.index] = 1;
//     });
// //This function looks up whether a pair are neighbours
//     function neighboring(a, b) {
//         return linkedByIndex[a.index + "," + b.index];
//     }
//     function connectedNodes() {
//         if (toggle == 0) {
//             //Reduce the opacity of all but the neighbouring nodes
//             d = d3.select(this).node().__data__;
//             node.style("opacity", function (o) {
//                 return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
//             });
//             link.style("opacity", function (o) {
//                 return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
//             });
//             //Reduce the op
//             toggle = 1;
//         } else {
//             //Put them back to opacity=1
//             node.style("opacity", 1);
//             link.style("opacity", 1);
//             toggle = 0;
//         }
//     }




// debugger

});


function updataGraph(data){



}


