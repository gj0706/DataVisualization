//======================draw and update world cloud=====================================
var cloudWidth = 600;
var cloudHeight = 500;
// var svg2 = d3.select(".word-cloud-div").append("svg")
//     .attr("width", cloudWidth)
//     .attr("height", cloudHeight)
//     .append("g")
//     .attr("transform", "translate(" + cloudWidth / 2 + "," + cloudHeight / 2 + ")");


var words = ["United States", "France", "Great Britain", "Italy", "Germany", "Canada", "Japan", "Sweden", "Australia", "Hungary",
    "London", "Athina", "Sydney", "Atlanta", "Rio de Janeiro", "Beijing", "Barcelona", "Los Angeles", "Seoul", "Munich", "Athletics",
    "Gymnastics", "Swimming", "Shooting", "Cycling", "Fencing", "Rowing", "Cross Country Skiing", "Alpine Skiing", "Wrestling",
    "Football Men's Football", "Ice Hockey Men's Ice Hockey", "Hockey Men's Hockey", "Water Polo Men's Water Polo",
    "Basketball Men's Basketball", "Cycling Men's Road Race, Individual", "Gymnastics Men's Individual All-Around",
    "Rowing Men's Coxed Eights", "Gymnastics Men's Team All-Around", "Handball Men's Handball",
    "Robert Tait McKenzie", "Heikki Ilmari Savolainen", "Joseph \"Josy\" Stoffel", "Ioannis Theofilakis", "Takashi Ono",
    "Alexandros Theofilakis", "Jean Lucien Nicolas Jacoby", "Andreas Wecker", "Alfrd (Arnold-) Hajs (Guttmann-)", "Alfred James Munnings"]

// d3.csv("data/yearly_freq.csv", function(data){
//     console.log(data)
// })


d3.csv("data/word_freq.csv", function(error, data){
    data.forEach(function(d){
        d.frequency = +d.frequency;
        d.year = +d.year;
    });

    var color = d3.scale.category20();

    var layout = d3.layout.cloud()
        .size([cloudWidth, cloudHeight])
        .words(data.map(function(d){return{text:d.word,size:d.frequency*5 ,frequency:d.frequency}}))
        // .padding(3)
        .rotate(0)
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw);
    layout.start();



    /* Initialize tooltip */
    var wordTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>Frequency:</strong> <span style='color:pink'>" + d + "</span>";
        });
    // svg2.call(wordTip);

    function draw(words) {
        var svg =d3.select("#cloud").append("svg")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")");

        /* Initialize tooltip */
        var wordTip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return "<strong>" + d.text + " :" + d.frequency + " </strong>";
            });

           svg.call(wordTip);
           svg.selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("fill", function(d, i) { return color(i); })
            .style("font-family", "Impact")
            .style("cursor", "pointer")
            .style("pointer-events", "all")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";})
            .text(function(d) { return d.text; })
            .on("mousemove", function (d) {
                d3.select(this).attr("opacity", "0.5");
                wordTip.show(d);
            })
            .on("mouseout", function (d) {
                d3.select(this).attr("opacity", "1");
                wordTip.hide();
            })    }
});
