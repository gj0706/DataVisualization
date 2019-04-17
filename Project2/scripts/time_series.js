var words = ["United States", "France", "Great Britain", "Italy", "Germany", "Canada", "Japan", "Sweden", "Australia", "Hungary",
    "London", "Athina", "Sydney", "Atlanta", "Rio de Janeiro", "Beijing", "Barcelona", "Los Angeles", "Seoul", "Munich", "Athletics",
    "Gymnastics", "Swimming", "Shooting", "Cycling", "Fencing", "Rowing", "Cross Country Skiing", "Alpine Skiing", "Wrestling",
    "Football Men's Football", "Ice Hockey Men's Ice Hockey", "Hockey Men's Hockey", "Water Polo Men's Water Polo",
    "Basketball Men's Basketball", "Cycling Men's Road Race, Individual", "Gymnastics Men's Individual All-Around",
    "Rowing Men's Coxed Eights", "Gymnastics Men's Team All-Around", "Handball Men's Handball",
    "Robert Tait McKenzie", "Heikki Ilmari Savolainen", "Joseph \"Josy\" Stoffel", "Ioannis Theofilakis", "Takashi Ono",
    "Alexandros Theofilakis", "Jean Lucien Nicolas Jacoby", "Andreas Wecker", "Alfrd (Arnold-) Hajs (Guttmann-)", "Alfred James Munnings"]

// d3.csv("data/year_word_freq.csv", function(error, data){
//     data.forEach(function(d){
//         d.year = +d.year;
//         d.freq = +d.frequency;
//     });
// });

// Set the dimensions of the canvas / graph
const margin = {top: 80, right: 90, bottom: 150, left: 80},
    width = 700 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Set the dimensions of zoom area
const marginZoom = {top: 500, right: 90, bottom: 30, left: 80},
    heightZoom = 600 - marginZoom.top - marginZoom.bottom;

// Add svg canvas to the body of the page
const svg = d3.select("#timeSeries")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
// .append("g")
// .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// clip path
svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);
// .attr("x", 0)
// .attr("y", 0);


// Parse the date / time
var parse = d3.time.format("%Y").parse;

// Set the ranges
const x = d3.time.scale().range([0, width]);
const y = d3.scale.linear().range([height - 20, 0]);
const color = d3.scale.category20();
// Set the ranges of zoomed x and y
const xZoom = d3.time.scale().range([0, width]);
const yZoom = d3.scale.linear().range([heightZoom - 10, 0]);

// Define the axes
const xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(6);
const yAxis = d3.svg.axis().scale(y).orient("left").ticks(8);
// Define zoomed x axes
const xAxisZoom = d3.svg.axis().scale(xZoom).orient("bottom").ticks(6);

// Brush function
var brush = d3.svg.brush()
    .x(xZoom)
    .on("brush", brush);

// Define main graph line
const valueline = d3.svg.line()
// .interpolate("basis")
    .defined(function (d) {
        return !isNaN(d.frequency);
    })
    .interpolate("cubic")
    .x(function (d) {
        return x(d.year);
    })
    .y(function (d) {
        return y(d.frequency);
    });

// Define zoomed line
const valuelineZoom = d3.svg.line()
    .defined(function (d) {
        return !isNaN(d.frequency);
    })
    .interpolate("cubic")
    .x(function (d) {
        return xZoom(d.year)
    })
    .y(function (d) {
        return yZoom(d.frequency)
    });


// add main graph area
var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add zoomed area
var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + marginZoom.left + "," + marginZoom.top + ")");

var div = d3.select("#timeSeries").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//========================== data processing  ==================================
// Load the data
d3.csv("data/year_word_freq.csv", function (error, data) {
    data.forEach(function (d) {
        d.year = parse(d.year);
        d.frequency = +d.frequency;
    });

    // sort data by year in ascending order
    data.sort(function (a, b) {
        if (a.year < b.year)
            return -1;
        else if (a.year > b.year)
            return 1;
        else
            return 0;
    });

    // group the entries by age groups
    let newData = d3.nest().key(item => item.word).entries(data);
    const words = d3.keys(newData[0]).splice(1);

    // Domain of the data
    x.domain(d3.extent(data, function (d) {
        return d.year;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.frequency;
    })]).nice();

    //Domain of the zoomed data
    xZoom.domain(x.domain());
    yZoom.domain(y.domain());

    focus.selectAll(".line").remove();
    context.selectAll(".line").remove();


//========================= Draw main graph and zoomed area=================================
    // tooltip
    var lineTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d, i) {
            return "<strong>" + d.key + " </strong>";

        })
    // debugger
    svg.call(lineTip);

    // draw main graph and lines; mouseover and mouseout effect
    focus.selectAll("line").data(newData).enter().append("path")
        .attr("class", "line")
        .attr("d", function (d) {
            return valueline(d.values)
        })
        .style("stroke", function (d) {
            return d.color = color(d.key);

        })
        .attr("id", function (d) {
            return 'tag' + d.key.replace(/\s+/g, '')
        }) // id for click effect
        .attr("clip-path", "url(#clip)")
        .on("mouseover", function (d1) {
            focus.selectAll(".line")
                .style("stroke-opacity", function (d2) {
                    if (d1 == d2)
                        return 1;
                    else
                        return 0.15;
                })
                .style("stroke-width", function (d3) {
                    if (d1 == d3)
                        return 3;
                    else
                        return 1.5;
                })
            d3.select(this).attr("opacity", "1");
            lineTip.show(d1);
            // div.transition()
            //     .duration(200)
            //     .style("opacity", 1.0);
            // div.html(d1.key + "<br/> " )
            //     .style("left", (d3.event.pageX) + "px")
            //     .style("top", (d3.event.pageY - 28) + "px")
        })
        .on("mouseout", function (d) {
            focus.selectAll(".line")
                .style("stroke-opacity", "1")
                .style("stroke-width", 1.5);
            // div.transition()
            //     .duration(500)
            //     .style("opacity", 0)
            // d3.select(this).attr("opacity", "1");
            lineTip.hide();
        });


    focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // draw zoomed area and lines
    context.selectAll(".line").data(newData).enter().append("path")
        .attr("class", "line")
        .attr("d", function (d) {
            return valuelineZoom(d.values)
        })
        .style("stroke", function (d) {
            return d.color = color(d.key);
        })
        .attr("id", function (d) {
            return 'tag1' + d.key.replace(/\s+/g, '')
        }) //id for click effect
        .attr("clip-path", "url(#clip)");

    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightZoom + ")")
        .call(xAxisZoom);

    context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", heightZoom + 7);


// //======================= Add legend and mouse click effect =============================
    // spacing for the legend
    // legendSpace = width / newData.length;
    const legendSpace = (height+margin.top) / newData.length;

    newData.forEach(function(d, i) {

        svg.append("text")
            .attr("x", width + margin.right + margin.left/1.8)
            // .attr("x", (legendSpace / 2) + i * legendSpace) // spacing
            // .attr("y", (height + (margin.bottom / 2) + 15)
            .attr("y", (legendSpace / 2) + i * legendSpace)
            .attr("class", "legend")    // style the legend
            .style("fill", function () { // dynamic colors
                return d.color = color(d.key);
            })
            .on("click", function () {
                // Determine if current line is visible
                var active = d.active ? false : true,
                    newOpacity = active ? 0 : 1;
                // Hide or show the elements based on the ID
                d3.select("#tag" + d.key.replace(/\s+/g, ''))
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                d3.select("#tag1" + d.key.replace(/\s+/g, ''))
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                // Update whether or not the elements are active
                d.active = active;
            })
            .text(d.key);

    })

debugger
//====================== Draw x, y labels ===========================================
    // draw the title of the chart
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "20px");
    // .style("text-decoration","underline")

    // label for x axis
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 40) + ")")
        .style("text-anchor", "middle")
        .text("Year");

    // label for y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left - 50)
        .attr("x", 0 - ((height + heightZoom) / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Frequency");


    // debugger;
    // select/clear all the lines
    var toggle = true;
    d3.select("input")
        .on("click", function () {
            d3.selectAll("path.line")
                .style("opacity", +(toggle = !toggle))
        })

});

function brush() {
    x.domain(brush.empty() ? xZoom.domain() : brush.extent());
    focus.selectAll("path.line")
        .attr("d", function (d) {
            return valueline(d.values)
        });
    focus.select(".x.axis").call(xAxis);
    focus.select(".y.axis").call(yAxis);
}