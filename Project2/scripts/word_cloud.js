//======================draw and update world cloud=====================================
var cloudWidth = 600;
var cloudHeight = 500;
// d3.csv("data/yearly_freq.csv", function(data){
//     console.log(data)
// })

d3.csv("data/word_freq.csv", function(error, data){

    data.forEach(function(d){
        d.frequency = +d.frequency;
        d.word = d.word;
        // debugger
    });

    var color = d3.scale.category20();

    // var layout= d3.layout.cloud()
    //     .size([cloudWidth, cloudHeight])
    //     .words(data.map(function(d){return{text:d.word,size:d.frequency/1.5,frequency:d.frequency}}))
    //     .rotate(0)
    //     .fontSize(function(d) { return d.size; })
    //     .on("end", draw);
    // // debugger
    // layout.start();
    //
    // function draw(words) {
    //     d3.select("#cloud").append("svg")
    //         .attr("width", layout.size()[0])
    //         .attr("height", layout.size()[1])
    //         .attr("class", "wordcloud")
    //         .append("g")
    //         // without the transform, words words would get cutoff to the left and top, they would
    //         // appear outside of the SVG area
    //         .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    //         .selectAll("text")
    //         .data(words)
    //         .enter().append("text")
    //         .style("font-size", function(d) { return d.size + "px"; })
    //         .style("fill", function(d, i) { return color(i); })
    //         .attr("transform", function(d) {
    //             return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    //         })
    //         .text(function(d) { return d.text; });
    // }

    var layout = d3.layout.cloud()
        .size([cloudWidth, cloudHeight])
        .words(data.map(function(d){return{text:d.word,size:d.frequency/1.5,frequency:d.frequency}}))
        // .padding(3)
        .rotate(0)
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw);

    layout.start();

    function draw(words) {
        d3.select("body").append("svg")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("fill", function(d, i) { return color(i); })
            .style("font-family", "Impact")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";})
            .text(function(d) { return d.text; });
    }
});
