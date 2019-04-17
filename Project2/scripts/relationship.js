var units = "Widgets";

// set the canvas
var margin1 = {top: 10, right: 10, bottom: 10, left: 10},
    width1 = 900 - margin1.left - margin1.right,
    height1 = 800 - margin1.top - margin1.bottom;
//
// width1 = 800;
// height1 = 600
var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function (d) {
        return formatNumber(d) + " " + units;
    };

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
        "translate(" + margin1.left + "," + margin1.top + ")");

// var data1;

function searchNode() {
    //find the node
    var selectedVal = document.getElementById('search').value;
    var node = svg2.selectAll(".node");
    if (selectedVal == "none") {
        node.style("stroke", "white").style("stroke-width", "1");
    } else {
        var selected = node.filter(function (d, i) {
            return d.name != selectedVal;
        });
        selected.style("opacity", "0");

        var link = svg2.selectAll(".link")
        link.style("opacity", "0");
        d3.selectAll(".node, .link")
            .style("color", "#ccc")
            .transition()
            .duration(5000)
            .style("opacity", 1);
    }
}
function updateGraph(data) {
    //Clear the current graph
    svg2.selectAll("*").remove();

    //set up an empty graph
    graph = {"nodes": [], "links": []};

    //get the headers for the data
    // var keys = Object.keys(data[0]);

    // create unique nodes and links: want nodes to be team(countries) and link targets to be year, sport and medal
    // so that we can have a network to see which team(country) in which year got what type of medal in which sport.

    data.forEach(function (d) {
        // adduniquenodes(d.year);
        // adduniquenodes(d.name);
        adduniquenodes(d.team);
        adduniquenodes(d.sport);
        adduniquenodes(d.medal);
        // adduniquenodes(d.event);
        // adduniquenodes(d.city);
        // adduniquenodes(d.year);

        // graph.links.push({
        //     "source": d.medal,
        //     "target": d.sport,
        //     "value": countvalues('medal', d.medal, 'sport', d.sport)
        // });
        // //
        graph.links.push({
            "source": d.team,
            "target": d.sport,
            "value": countvalues('team', d.team, 'sport', d.sport)
        });

        graph.links.push({
            "source": d.sport,
            "target": d.medal,
            "value": countvalues('sport', d.medal, 'team', d.medal)
        });
        //     graph.links.push ( {"source" : d.sport,
        //         "target" :d.event,
        //         "value" : countvalues('sport',d.sport,'event',d.event)
        //     });
    });


    // process the data to create nodes and links

    // data.forEach(function(d) {
    //     keys.forEach(function (key, i) {
    //         if (d[key] != "none") {
    //             adduniquenodes(d[key]);
    //         } //add node if not "none"
    //         var c = 1; //checks next column
    //         if (d[keys[i + c]] != undefined && d[key] !== "none") {
    //             while (d[keys[i + c]] === "none") {
    //                 c = c + 1;     //jump to next column if "none" found in the column next
    //             }
    //             graph.links.push({
    //                 "source": d[key],
    //                 "target": d[keys[i + c]],
    //                 "value": countvalues(key, d[key], keys[i + c], d[keys[i + c]])
    //             });
    //         }
    //     })
    // });
    // debugger

    // compute distinct nodes
    function adduniquenodes(value) {
        if (graph.nodes.indexOf(value) === -1) {
            //     if (graph.nodes.value > 10){
            graph.nodes.push(value);
        }
    }

    // count the values
    function countvalues(sourcekey, source, targetkey, target) {
        var c = 0;
        data.forEach(function (d) {
            if (d[sourcekey] === source && d[targetkey] === target) {
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
        graph.nodes[i] = {"name": d};
    });
    // graph.links.filter(d=>d.value === true);

    // debugger

    /* Initialize tooltip */
    var nodeTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>" + d.name + " </strong>";
        });

    svg1.call(nodeTip);

    linkScale.domain(d3.extent(graph, function (d) {
        return d.value;
    }));

    // define force layout
    var force = d3.layout.force()
        .nodes(graph.nodes)
        .links(graph.links)
        .size([width1, height1])
        .linkDistance(200)
        .charge(-200)

        .on("tick", tick)
        // .on("end", draw)
        .start();


    // function draw(network) {


    var drag = force.drag()
        .on("dragstart", dragstart);

    // build the arrow
    // svg2.append("svg:defs").selectAll('marker')
    //     .data(['end'])
    //     .enter()
    //     .append("svg:marker")
    //     .attr('id', function (d) {
    //         return d;
    //     })
    //     .attr('viewBox', '0 -5 10 10')
    //     .attr('refX', 15)
    //     .attr('refY', -1.5)
    //     .attr('markerWidth', 6)
    //     .attr('markerHeight', 6)
    //     .attr('orient', 'auto')
    //     .append('svg:path')
    //     .attr("d", "M0,-5L10,0L0,5");

    // add the links
    var link = svg2.selectAll(".link")
        .data(force.links());

    link.exit().remove();

    link.enter()
        .append("path")
        .classed("link", true)
        .attr("marker-end", "url(#end)");


    // define the nodes and mouse events
    var node = svg2.selectAll(".node")
        .data(force.nodes());

    node.exit().remove();

    node.enter()
        .append("g")
        .classed("node", true)
        // .on("click", click)

        .on("mouseover", function (d) {
            link.style('stroke-width', function (l) {
                if (d === l.source || d === l.target)
                    return 4;
                else
                    return 1;
            });
            nodeTip.show(d);
        })
        .on("mouseout", function () {
            link.style("stroke-width", 1)
            nodeTip.hide();
        })
        .on("dblclick", dblclick)
        .call(drag);

    //add the nodes
    node.append("circle")
        .attr("r", 10)
        .style("fill", function (d) {
            return color1(d.name)
        });

    // add the text
    node.append("text")
        .attr("x", 20)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.name;
        });

    // force.selectAll("circle")
    //     .exit().transition()
    //     .duration(200)
    //     .attr("r", 0)
    //     .remove();
    //
    // force.selectAll("path")
    //     .exit().transition()
    //     .duration(200)
    //     .attr("stroke-opacity", 0)
    //     .remove();


    // add the curvy lines
    function tick() {


        link.attr("d", function (d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y;
                dr = Math.sqrt(dx * dx + dy * dy)
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

    // // click on the node will cause it enlarged
    // function click() {
    //     d3.select(this).select("text").transition()
    //         .duration(750)
    //         .attr("x", 22)
    //         .style("fill", "steelblue")
    //         .style("stroke", "lightsteelblue")
    //         .style("stroke-width", ".5px")
    //         .style("font", "20px sans-serif");
    //
    //     d3.select(this).select("circle").transition()
    //         .duration(750)
    //         .attr("r", 16);
    // }

    // double click on the node will cause stuck node back to normal
    function dblclick(d) {
        d3.select(this).classed("fixed", d.fixed = false);
        // d3.select(this).select("text").transition()
        //     .duration(750)
        //     .attr("x", 12)
        //     .style("fill", "black")
        //     .style("stroke", "none")
        //     .style("stroke-width", "none")
        //     .style("font", "10px sans-serif");

        // d3.select(this).select("circle").transition()
        //     .duration(750)
        //     .attr("r", 6);
    }

    function dragstart(d) {
        d3.select(this).classed("fixed", d.fixed = true);
    }





    // }







    //search function
    var optArray = []; // placeholder for search names

    // collect all the node names for search auto-complete
    for (var i = 0; i < graph.nodes.length - 1; i++) {
        optArray.push(graph.nodes[i].name);
    }
    optArray = optArray.sort();
    $(function () {
        $("#search").autocomplete({
            source: optArray
        });
    });
}


