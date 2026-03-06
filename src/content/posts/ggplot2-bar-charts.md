---
title: "A First Look at Visualising Data With R and ggplot2"
date: 2025-10-11
excerpt: "An introduction to plotting with ggplot2 using the Palmer Archipelago penguin dataset — covering bar charts, themes, and combining plots."
image: https://asymptopic.com/uploads/2025/image.jpg
---

R and its ggplot2 package are wonderful tools for visualising data. In this post, we will explore some of the basics of plotting with ggplot2 by creating bar charts using the famous Palmer Archipelago dataset.

![Artwork by @allison_horst](https://asymptopic.com/uploads/2025/image.jpg)

Artwork by @allison_horst.

The dataset being used can be downloaded directly (in csv format) from [Kaggle](https://www.kaggle.com/code/parulpandey/penguin-dataset-the-new-iris) or imported directly into R with the `palmerpenguins` package.

# Importing the Data

Move the dataset to the location of the R script you will be plotting in, or use a relative path. Remember that for R to find your file you may need to set your current working directory, you can do this in RStudio by clicking `Session <- Set Working Directory <- To Source File Location` in the banner, or by running the `setwd("/your_path_here")` command.

You can import the penguins dataset using the `read.csv()` function, built into R.

```R
# Import the penguins dataset using the read.csv() function
penguins <- read.csv("penguins_size.csv")

# View the first few entries of the dataframe
print(penguins[1:5,])
```

Output:

```
species    island culmen_length_mm culmen_depth_mm flipper_length_mm
1  Adelie Torgersen             39.1            18.7               181
2  Adelie Torgersen             39.5            17.4               186
3  Adelie Torgersen             40.3            18.0               195
4  Adelie Torgersen               NA              NA                NA
5  Adelie Torgersen             36.7            19.3               193
  body_mass_g    sex
1        3750   MALE
2        3800 FEMALE
3        3250 FEMALE
4          NA   <NA>
5        3450 FEMALE
```

# Cleaning Up

Viewing the dataset by printing the first few rows has revealed our first issue, this data has several NA values. A great way to visualise the amount of data missing in a given dataframe in R is using the `vis_miss` function from the `naniar` library. You may need to install this by running `install.packages('naniar')`.

```R
# install.packages('naniar')
library(naniar)
vis_miss(penguins)
```

![Missing data visualisation](https://asymptopic.com/uploads/2025/image-1.jpg)

Reassuringly the dataset has very few missing values. The easiest way to deal with these will be to exclude them using `na.omit()` which simply removes each row in a dataframe that has any NA values in it.

```R
penguins <- na.omit(penguins)
vis_miss(penguins)
```

![No missing data](https://asymptopic.com/uploads/2025/image-2.jpg)

Another good idea when working with a new dataset is to make sure that any categorical variables are treated as factors in R. This can be done with `as.factor(col)` and makes sure that plots of categorical variables work correctly.

```R
penguins$sex <- as.factor(penguins$sex)
penguins$island <- as.factor(penguins$island)
penguins$species <- as.factor(penguins$species)
```

We can also change the names of any columns. Below I have changed the names of the variables we will be plotting to be capitalised so that they will look a little nicer in legends.

```R
names(penguins)[names(penguins) == 'island'] <- 'Island'
names(penguins)[names(penguins) == 'species'] <- 'Species'
names(penguins)[names(penguins) == 'sex'] <- 'Sex'
```

There is one more issue with the dataset in its current form. The sex for one observation is missing, instead containing just a full stop. A helpful side effect of converting our categorical variables to factors is that we can see this easily by printing the levels of each factor variable.

```R
print(levels(penguins$Sex))
```

Output:
```
[1] "."      "FEMALE" "MALE"
```

```R
print(levels(penguins$Island))
```

Output:
```
[1] "Biscoe"    "Dream"     "Torgersen"
```

```R
print(levels(penguins$Species))
```

Output:
```
[1] "Adelie"    "Chinstrap" "Gentoo"
```

To handle this we can use the `filter()` function from the `dplyr` library. The `!` before `(Sex == ".")` means that rather than returning the dataset with only rows where the sex of the penguin is "." the function will do the opposite and select all rows where the sex does not equal ".".

```R
library(dplyr)
penguins <- filter(penguins, !(Sex == "."))
```

We are now ready to start plotting. For this first look at ggplot2 we will focus on bar plots.

# Creating Plots

To create any plot with ggplot2 we first need to create the plot area with the `ggplot()` function. For all plots we will need to specify the data being used and any aesthetics we wish to pass through to the graphs we will be plotting.

```R
library(ggplot2)

ggplot(data = penguins, aes(x=Species)) +
  geom_bar()
```

![Basic bar chart](https://asymptopic.com/uploads/2025/image-3.jpg)

Intuitively, we add new elements to a plot with +. For this tutorial we use `geom_bar()` for a bar plot but other plots available include `geom_point()` for a scatter plot, `geom_col()` for a column plot or `geom_line()` for a line plot. We could even add multiple plots to the same axes.

```R
penguins |>
  ggplot(aes(x=Island, fill=Species)) +
  geom_bar()
```

![Bar chart by island](https://asymptopic.com/uploads/2025/image-4.jpg)

We can enhance our plots by adding some labels using `labs()` to add a title, x-axis and y-axis.

```R
penguins |>
  ggplot(aes(x=Species, fill=Species)) +
  geom_bar()+
  labs(title="Penguins in the Palmer Archipelago",
       x = "Species",
       y="Penguin Count")
```

![Labelled bar chart](https://asymptopic.com/uploads/2025/image-6.jpg)

```R
penguins |>
  ggplot(aes(x=Island, fill=Species)) +
  geom_bar(position = "dodge2")+
  labs(title="Penguins in the Palmer Archipelago",
       x = "Island",
       y="Penguin Count")
```

![Dodged bar chart](https://asymptopic.com/uploads/2025/image-5.jpg)

Themes allow us to customise our plots further. There are many built into ggplot2 however my favourite, easy to implement, themes are those in the `ggthemes` package.

```R
library(ggthemes)

penguins |>
  ggplot(aes(x=Species, fill=Species)) +
  geom_bar()+
  labs(title="Penguins in the Palmer Archipelago",
       x="Species",
       y="Penguin Count") +
  geom_rangeframe() +
  theme_hc() +
  scale_fill_hc()+
  theme(legend.position = "none")
```

![HC theme](https://asymptopic.com/uploads/2025/image-7.jpg)

```R
penguins |>
  ggplot(aes(x=Island, fill=Species)) +
  geom_bar(position = "dodge2")+
  labs(title="Penguins in the Palmer Archipelago",
       x = "Island",
       y="Penguin Count",
       fill="Species") +
  geom_rangeframe() +
  scale_fill_economist()+
  theme_economist()
```

![Economist theme](https://asymptopic.com/uploads/2025/image-8.jpg)

```R
penguins |>
  ggplot(aes(x=Sex, fill=Species)) +
  geom_bar(position = "dodge2")+
  labs(title="Penguins in the Palmer Archipelago",
       x = "Sex",
       y="Penguin Count",
       fill="Species") +
  geom_rangeframe() +
  scale_fill_few()+ 
  theme_calc()
```

![Calc theme](https://asymptopic.com/uploads/2025/image-9.jpg)

# Combining Plots

We can use a facet grid to combine all of the information from our plots so far into a single, easy to read plot.

```R
library(MASS) 
library(reshape2) 
library(reshape) 

penguin_2 <- melt(penguins, id = c('culmen_length_mm', 'culmen_depth_mm',
                                   'flipper_length_mm', 'body_mass_g',
                                   'Species','Sex'))

sex.labs <- c("Male", "Female")
names(sex.labs) <- c("MALE", "FEMALE")

ggplot(penguin_2, aes(x=value, fill = Species))+
  geom_bar(position = "dodge2")+
  facet_grid(Sex~variable,
             scales="free",
             space="free_x", 
             labeller = labeller(Sex=sex.labs))+
  labs(x="",
       y="Penguin Count",
       title="Penguins in the Palmer Archipelago")+
  theme_hc()+
  scale_fill_manual(values=c("#FF8100", "#C25ECA", "#067476"))
```

![Facet grid](https://asymptopic.com/uploads/2025/image-10.jpg)

# Conclusion

This final plot shows us the distribution of penguins across each island, for each species and for both sexes.

In the next post we will begin looking at the other variables in the dataset such as body mass and flipper length and look at if these vary based on sex, island or species.