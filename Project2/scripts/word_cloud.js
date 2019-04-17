//======================draw and update world cloud=====================================
var cloudWidth = 500;
var cloudHeight = 500;

var fontScale = d3.scale.linear().range([0, 50]);

var fill = d3.scale.category20();
var svg1 = d3.select("#cloud").append("svg")
    .attr("width", cloudWidth)
    .attr("height", cloudHeight)
    .append("g")
    .attr("transform", "translate(" + cloudWidth / 2 + "," + cloudHeight / 2 + ")");

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
    "Alexandros Theofilakis", "Jean Lucien Nicolas Jacoby", "Andreas Wecker", "Alfrd (Arnold-) Hajs (Guttmann-)", "Alfred James Munnings"];


d3.csv("data/year_word_freq.csv", function (error, data) {

    d3.csv("data/network.csv", function (error1, data1) {
        //
        data1.forEach(d=>{d.year = +d.year});

        data.forEach(function (d) {
            d.frequency = +d.frequency;
            d.year = +d.year;
        });


        var newData = d3.nest().key(d => d.year).entries(data);
        var newData1 = d3.nest().key(d => d.word).entries(data);
        newData = newData.map(item => {
            const newItem = {year: +item.key};
            item.values.forEach(v => {
                newItem[v.word] = +v.frequency;
            });
            return newItem;
        });
// debugger
        var yearMap = {};
        newData.forEach(function (d) {
            var year = d.year;
            yearMap[year] = [];
            words.forEach(function (word) {
                yearMap[year].push(d[word]);
            });
        });
        // debugger

        //draw cloud
        function draw(words) {


            /* Initialize tooltip */
            var wordTip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                    return "<strong>" + d.text + " :" + d.frequency + " </strong>";
                });

            svg1.call(wordTip);

            //draw the word cloud
            var cloud = svg1.selectAll("text")
                .data(words, function (d) {
                    return d.text;
                })

            //entering words
            cloud.enter().append("text")
                .style("font-size", function (d) {
                    // return d.size + "px";
                    return fontScale(d.frequency);
                })
                .style("fill", function (d, i) {
                    return fill(i);
                })
                .style("font-family", "Impact")
                .style("cursor", "pointer")
                .style("pointer-events", "all")
                .attr("text-anchor", "middle")
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function (d) {
                    return d.text;
                })
                .on("mousemove", function (d) {
                    d3.select(this).attr("opacity", "0.5");
                    wordTip.show(d);
                })
                .on("mouseout", function (d) {
                    d3.select(this).attr("opacity", "1");
                    wordTip.hide();
                });

            //entering and existing words
            cloud.transition()
                .duration(200)
                .style("font-size", function (d) {
                    // return d.size + "px";
                    return fontScale(d.frequency);
                })
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1);

            //exiting words
            cloud.exit()
                .transition()
                .duration(200)
                .style("fill-opacity", 1e-6)
                .attr("font-size", 1)
                .remove();
        }


        // debugger

        // update cloud
        var updateCloud = function (data) {
            fontScale.domain([d3.min(data, function (d) {
                return d.frequency;
            }),
                d3.max(data, function (d) {
                    return d.frequency;
                }),
            ]);
            d3.layout.cloud()
                .size([cloudWidth, cloudHeight])
                // .words(data)
                .words(data.map(function (d) {
                    return {text: d.word, size: d.frequency * 5, frequency: d.frequency}
                }))
                .rotate(0)
                // .rotate(function () { return ~~(Math.random() * 2) * 90; })
                .text(function (d) {
                    return d.text;
                })
                .font("Impact")
                .fontSize(function (d) {
                    return fontScale(d.frequency);
                })
                .on("end", draw)
                .start();
        }

        var dropdownChange = function () {
            var newYear = +d3.select(this).property('value'),
                newData2 = data.filter(d => d.year === newYear);
            var newData3 = data1.filter(d => d.year === newYear);
            updateCloud(newData2);
            updateGraph(newData3)
            // debugger
        };
        // Get names of years, for dropdown
        var years = Object.keys(yearMap).sort();

        var dropdown = d3.select("#dropDown")
            .insert("select", "svg")
            .on("change", dropdownChange);

        dropdown.selectAll("option")
            .data(years)
            .enter().append("option")
            .attr("value", function (d) {
                return d;
            })
            .text(function (d) {
                return d;
            });



        var initialData = data.filter(d => d.year === 1896);
        updateCloud(initialData);
        updateGraph(data1.filter(d=>d.year == 1896));

    })
})