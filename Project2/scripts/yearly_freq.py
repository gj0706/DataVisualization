#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Mar 30 13:57:29 2019

@author: Jian Guo
"""

import pandas as pd
import matplotlib.pyplot as plt

# read the data
data = pd.read_csv('/Users/jaywang/Documents/TTU_study/Spring2019/CS5331DataVisualization/Projects/Project2/data/athletes.csv',header=0)
data_freq = pd.read_csv('/Users/jaywang/Documents/TTU_study/Spring2019/CS5331DataVisualization/Projects/Project2/data/word_freq.csv',header=0)

# set data frame
df = pd.DataFrame(data, columns=data.columns)
df_freq = pd.DataFrame(data_freq, columns=data_freq.columns)

# group data by year-team, year-city and year-sport
year_name = df.groupby(["Year", "Name"])["Name"].count()
year_team = df.groupby(["Year", "Team"])["Team"].count()
year_city = df.groupby(["Year", "City"])["City"].count()
year_sport = df.groupby(["Year", "Sport"])["Sport"].count()
year_event = df.groupby(["Year", "Event"])["Event"].count()


years = list(set(data.iloc[:,2]))
# create data frames for yearly frequency of team, city and sport
year_team_freq = year_team.unstack(level = -1).fillna(0)
year_city_freq = year_city.unstack(level = -1).fillna(0)
year_sport_freq = year_sport.unstack(level = -1).fillna(0)
year_event_freq = year_event.unstack(level = -1).fillna(0)
year_name_freq = year_name.unstack(level = -1).fillna(0)
#year_team_freq.sort_values(by=years).head()

#sort columns to get most frequent words in one year
#year_team_freq = year_city_freq.apply(lambda x: x.sort_values(ascending=False).values)


team_year_freq = year_team.unstack(level = 0).fillna(0)
city_year_freq = year_city.unstack(level = 0).fillna(0)
sport_year_freq = year_sport.unstack(level=0).fillna(0)
event_year_freq = year_event.unstack(level = 0).fillna(0)

# plot data
#year_team_freq.plot.bar()
#plt.show()

top_team_freq = year_team_freq.filter(df_freq["team"])
top_sport_freq = year_sport_freq.filter(df_freq["sport"])
top_event_freq = year_sport_freq.filter(df_freq["event"])
top_name_freq = year_name_freq.filter(df_freq["name"])


teams = top_team_freq.iloc[0,:].index



# write to csv files
# =============================================================================
# year_team_freq.to_csv("year_team_freq.csv")
# year_city_freq.to_csv("year_city_freq.csv")
# year_sport_freq.to_csv("year_sport_freq.csv")
# year_event_freq.to_csv("year_event_freq.csv")
# 
# team_year_freq.to_csv("team_year_freq.csv")
# sport_year_freq.to_csv("sport_year_freq.csv")
# event_year_freq.to_csv("_sport_freq.csv")
# =============================================================================

# =============================================================================
# top_team_freq.to_csv("top_team_freq.csv")
# top_sport_freq.to_csv("top_sport_freq.csv")
# top_event_freq.to_csv("top_event_freq.csv")
# =============================================================================








