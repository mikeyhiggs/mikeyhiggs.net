---
title: "Creating Waffle Plots in R with Waffle"
date: 2025-10-15
excerpt: "Using the waffle package in R to visualise Olympic medal counts — covering basic waffle plots, pictograms, and combining multiple plots with cowplot and iron()."
image: https://asymptopic.com/uploads/2025/waffle3.png
---

In this post we will be creating waffle plots with R, using the `waffle()` function from the package of the same name. In terms of necessary packages I would recommend `dplyr`, `tidyr` and of course `waffle`.

```R
library(dplyr)
library(tidyr)
library(waffle)
```

# Importing The Data

Waffle plots are best used to visualise count data, often as an alternative to something like a pie chart or bar chart. The data we will be using is a count of medals won at the Paris 2024 Olympic Games by country. This dataset is from [Kaggle](https://www.kaggle.com/datasets/berkayalan/paris-2024-olympics-medals).

# Processing The Data

```R
olympic_data <- read.csv('olympics2024.csv')
print(head(olympic_data))
```

Output:
```
Rank Country        Country.Code Gold Silver Bronze Total
1    United States  US           40   44     42     126
2    China          CHN          40   27     24     91
3    Japan          JPN          20   12     13     45
4    Australia      AUS          18   19     16     53
5    France         FRA          16   26     22     64
6    Netherlands    NED          15   7      12     34
```

```R
olympic_data <- olympic_data |>
  select(-c(Total, Country.Code))

olympic_data$Country <- as.factor(olympic_data$Country)
```

To plot a waffle plot we need our data in long format using `pivot_longer()`.

```R
long_data <- olympic_data |>
  pivot_longer(
    cols = c(Gold, Silver, Bronze),
    names_to = "Medal",
    values_to = "Count"
  )
```

Output:
```
Rank Country       Medal  Count
1    United States Gold   40
1    United States Silver 44
1    United States Bronze 42
2    China         Gold   40
2    China         Silver 27
2    China         Bronze 24
```

# Creating Waffle Plots

```R
GB_data <- long_data |> filter(Country == 'Great Britain')

waffle(data.frame(GB_data$Medal, GB_data$Count))
```

![Basic waffle](https://asymptopic.com/uploads/2025/waffle1.png)

We could do with tidying this plot up. It is also worth finding a number of rows that avoids leftover squares — we can find this using prime factors.

```R
library(numbers)

total <- sum(GB_data$Count)
print(primeFactors(total))
```

Output:
```
[1]  5 13
```

```R
waffle(data.frame(GB_data$Medal, GB_data$Count), rows = 5,
       title = "Team GB Medals: Paris 2024",
       legend_pos = "bottom")
```

![Tidied waffle](https://asymptopic.com/uploads/2025/waffle2.png)

```R
waffle(data.frame(GB_data$Medal, GB_data$Count), rows = 5,
       title = "Team GB Medals: Paris 2024",
       legend_pos = "bottom",
       colors = c('#d4af37', '#c0c0c0', '#cd7f32'))
```

![Coloured waffle](https://asymptopic.com/uploads/2025/waffle3.png)

We can also turn this into a pictogram using fontawesome.

```R
library(extrafont)
library(fontawesome)
loadfonts(device = 'all')

waffle(data.frame(GB_data$Medal, GB_data$Count), rows = 5,
       title = "Team GB Medals: Paris 2024",
       legend_pos = "bottom",
       colors = c('#d4af37', '#c0c0c0', '#cd7f32'),
       use_glyph = 'medal', glyph_size = 8)
```

![Pictogram waffle](https://asymptopic.com/uploads/2025/waffle4.png)

# Combining Plots

To simplify our code I am going to create a function to make a waffle plot for any country.

```R
country_waffle <- function(country, data = long_data, legend_pos = 'none', size = 0.25) {
  data <- data |> filter(data$Country == country)
  plot <- waffle(data.frame(data$Medal, data$Count), 
                 size = size, legend_pos = legend_pos,
                 keep = FALSE, colors = c('#d4af37', '#c0c0c0', '#cd7f32'),
                 title = paste(country, ':', data$Rank[1]))
  return(plot)
}
```

```R
country_waffle("Australia", size = 1, legend_pos='bottom')
```

![Australia waffle](https://asymptopic.com/uploads/2025/waffle5.png)

Now let's combine the top five countries with `cowplot`.

```R
library(cowplot)

top_countries <- filter(long_data, Rank %in% c(1, 2, 3, 4, 5))$Country |> unique()

title <- ggdraw() + 
  draw_label(
    "Paris 2024 Olympic Games: Medals for Top 5 Countries",
    fontface = 'bold',
    hjust = 0
  )

plot_grid(title, geom_blank(), geom_blank(),
          country_waffle(top_countries[1]),
          country_waffle(top_countries[2]),
          country_waffle(top_countries[3]),
          country_waffle(top_countries[4]),
          country_waffle(top_countries[5], legend_pos = 'right'),
          ncol=3)
```

![Combined waffle cowplot](https://asymptopic.com/uploads/2025/waffle6.png)

Alternatively we can use the built in `iron()` function from `waffle`.

```R
iron(country_waffle(top_countries[1]),
     country_waffle(top_countries[2]),
     country_waffle(top_countries[3], legend_pos = 'bottom'))
```

![Combined waffle iron](https://asymptopic.com/uploads/2025/waffle7.png)

The `iron()` function is better for a smaller number of plots as it can squish things quite a bit.

This is not the only way of creating waffle plots — in a future post I will be looking at creating waffle plots with `geom_waffle` instead, which is definitely the way to go when trying to do something a bit more complicated.