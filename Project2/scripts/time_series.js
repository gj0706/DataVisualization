


var words = ["United States", "France", "Great Britain", "Italy", "Germany", "Canada", "Japan", "Sweden", "Australia", "Hungary",
    "London", "Athina", "Sydney", "Atlanta", "Rio de Janeiro", "Beijing", "Barcelona", "Los Angeles", "Seoul", "Munich", "Athletics",
    "Gymnastics", "Swimming", "Shooting", "Cycling", "Fencing", "Rowing", "Cross Country Skiing", "Alpine Skiing", "Wrestling",
    "Football Men's Football", "Ice Hockey Men's Ice Hockey", "Hockey Men's Hockey", "Water Polo Men's Water Polo",
    "Basketball Men's Basketball", "Cycling Men's Road Race, Individual", "Gymnastics Men's Individual All-Around",
    "Rowing Men's Coxed Eights", "Gymnastics Men's Team All-Around", "Handball Men's Handball",
    "Robert Tait McKenzie", "Heikki Ilmari Savolainen", "Joseph \"Josy\" Stoffel", "Ioannis Theofilakis", "Takashi Ono",
    "Alexandros Theofilakis", "Jean Lucien Nicolas Jacoby", "Andreas Wecker", "Alfrd (Arnold-) Hajs (Guttmann-)", "Alfred James Munnings"]

d3.csv("data/yearly_freq_norm.csv", function(error, data){
    data.forEach(function(d){
        d.year = +d.year;
    });






});

