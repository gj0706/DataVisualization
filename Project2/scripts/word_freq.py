#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Mar 27 11:49:48 2019

@author: Jian Guo
"""

import pandas as pd

# read file and create data frame
data = pd.read_csv('/Users/jaywang/Documents/TTU_study/Spring2019/CS5331DataVisualization/Projects/Project2/data/athletes.csv',header=0)
df = pd.DataFrame(data, columns=data.columns)


# compute top 50 highest frequent words in each category
name_count = df["Name"].value_counts()[0:50]
team_count = df["Team"].value_counts()[0:50]
year_count = df["Year"].value_counts()[0:50]
city_count = df["City"].value_counts()[0:50]
sport_count = df["Sport"].value_counts()[0:50]
event_count = df["Event"].value_counts()[0:50]

# convert above serieses to data frames
df_name = pd.DataFrame({"name": name_count.index, "n_frequency": name_count.values} )
df_team = pd.DataFrame({"team": team_count.index, "t_frequency": team_count.values})
df_year = pd.DataFrame({"year": year_count.index, "y_frequency": year_count.values})
df_city = pd.DataFrame({"city": city_count.index, "c_frequency": city_count.values})
df_sport = pd.DataFrame({"sport": sport_count.index, "s_frequency": sport_count.values})
df_event = pd.DataFrame({"event": event_count.index, "e_frequency": event_count.values})

# conbmine and write to csv file
df_left = df_name.join(df_team)
df_right = df_city.join(df_sport) 
df_freq = df_left.join(df_right).join(df_event)

#df_freq.to_csv("word_freq.csv")
