//======================draw and update world cloud=====================================
var cloudWidth = 600;
var cloudHeight = 500;

d3.csv("data/word_freq.csv", function(error, data){

    data.forEach(function(d){
        d.n_freq = +d.n_frequency;
        d.t_freq = +d.t_frequency;
        d.c_freq = +d.c_frequency;
        d.s_freq = +d.s_frequency;
    });

    var color = d3.scale.category20();

    var layout= d3.layout.cloud()
        .size([cloudWidth, cloudHeight])
        .words(data.map(function(d){return{text:d.city,size:d.c_freq/1.5,frequency:d.c_freq}}))
        .rotate(0)
        .fontSize(function(d) { return d.size; })
        .on("end", draw);
    // debugger
    layout.start();

    function draw(words) {
        d3.select("body").append("svg")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .attr("class", "wordcloud")
            .append("g")
            // without the transform, words words would get cutoff to the left and top, they would
            // appear outside of the SVG area
            .attr("transform", "translate(220,200)")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("fill", function(d, i) { return color(i); })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }


});
