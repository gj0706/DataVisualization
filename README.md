## Project2 description:

Project2 for course CS5331. It is a project on interactive text, network and geospatial visualization. The project is a web-based application in javascript, html, and D3

### Video demo link:
[Video demo on YouTube](https://www.youtube.com/watch?v=la17bteKVQg)

### Web link:
[Text and Network Visualization:](https://github.com/gj0706/DataVisualization/blob/master/Project2/index.html)

## Data description:

1. Source: [kaggle.com](https://www.kaggle.com/heesoo37/120-years-of-olympic-history-athletes-and-results). Data used for this project is "120 years of Olympic history: athletes and results",a historical dataset on the modern Olympic Games, including all the names of the athlets, teams, sports, cities, etc., from Athens 1896 to Rio 2016. 

## Data Preprocess:

1. Removed all the unrelated columns, including athletes sex, age, weight, height and so on. 

2. Use Python Pandas library to group data by year, and count the frequency of words in each category per year. Output as csv files.

3. Use online tools to generate latitute and longtitute of high-frequency locations appear in the data, output as csv files.

## Functionality

1. Word cloud: with the dropdown menu selection, shows the top-frequency 50 words appeared in the data in each year. Mousing over a word will highlight the selected word and show its frequency.



2. Time series: shows the frequencies of each word over time, from 1896 to 2016. Hover on a line will show the word.

![alt text](https://github.com/gj0706/DataVisualization/blob/master/Project2/images/home.png)


3. Relationship: with the nodes being team, sport and medal, links connecting team and sport, sport and medal, the force layout graph shows a network of which team won what type of medal in wich sport. The dropdown menu for the word cloud controls the network, too. User can select a year to see how team, sport and medal are related to each other. The search input helps locate a certain word well. It has an auto-complete feature so by typping in an initial letter, user can find a drop down of all the words start with that letter and select one. 

![alt text](https://github.com/gj0706/DataVisualization/blob/master/Project2/images/relation.png)

3. Map: shows all the locations appeared in the top 50 words. The red dots are plotted on the map by the latitude and longtitude of the locations. The map is zoomable.

![alt text](https://github.com/gj0706/DataVisualization/blob/master/Project2/images/map.png)



## Findings:

1. The Olympic games shows a pattern on the line chart, indicating that it is getting more reguarly held and the venues are becoming stable. On the contrast, in the early years of Olympics, the number of teams and sports varient greatly over time. 

![alt text](https://github.com/gj0706/DataVisualization/blob/master/Project2/images/pattern.png)


2. The word cloud shows that in 1948, Japan and Germany both have zero frequency on the time series line chart because they were not invited to attend due to World War II. 


![alt text](https://github.com/gj0706/DataVisualization/blob/master/Project2/images/Japan.png)


![alt text](https://github.com/gj0706/DataVisualization/blob/master/Project2/images/Germany.png)


### References:

http://developer.mapquest.com/documentation/samples/geocoding/v1/batch/

https://en.wikipedia.org/wiki/1948_Summer_Olympics



=============================================================================================================================


## Project1 description:

Project1 for course CS5331. It is an individual project on interactive time series data visualization. The project is a web-based application in javascript, html, and D3

![alt text](https://github.com/gj0706/DataVisualization/blob/master/Project1/p1.%3CGuo%3E.%3CJian%3E.gif)

### Video demo link:
[Video demo on YouTube](https://www.youtube.com/watch?v=la17bteKVQg)

### Web link:
[Data Visualization Project 1](https://gj0706.github.io/DataVisualization/Project1/birthRate.html)


## Data description:

1. Data used for this project is "Birth Rates for Females by Age Group: United State", from [Centers for Disease Control and Prevention](https://data.cdc.gov/NCHS/NCHS-Birth-Rates-for-Females-by-Age-Group-United-S/yt7u-eiyg)

2. This dataset includes birth rates for females by age group in the United States from 1940 to 2015. There are 8 female age groups, including 10-14 years, 15-29 years, 20-14 years, 30-34 years, 35-39 years, 40- 44 years and 45-49 years. Birth rate here is calculated as number of birth per 1000 female population.


## Findings

1. Birth rates in all age groups reached their peak in the 1950s and early 1960s.
![alt text](https://github.com/gj0706/DataVisualization/blob/master/Project1/img/multiLine.png)

  The main cause is the baby boom in the United States after World War II. Young coulples had been holding off on having babys during World War II because of the Great Depression and it was also unsafe to raise children during the war. After the war, couples were eager to have children and start a family because they feel safe again. 

2. Birth rates decreased sharply in the 1970s after abortion was legalized.


3. Birth rates in younger age groups: 15-19 years, 20-24 years has been decreasing, which is most likely due to the increasing use of contraceptive devices. On the other hand, the birth rates for women in older age groups such as 30-34 years and 35-39 years have been increasing. The main reason could be that more women are going to college and thus they tend to marry later. 




### References

https://en.wikipedia.org/wiki/Baby_boom

https://www.nytimes.com/interactive/2018/08/04/upshot/up-birth-age-gap.html




