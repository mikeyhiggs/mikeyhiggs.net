---
title: "Creating Scatter Plots with ggplot2"
date: 2025-10-12
excerpt: "Continuing the Palmer Archipelago series — exploring scatter plots, marginal distributions, lines of best fit, and facet grids in ggplot2."
image: https://asymptopic.com/uploads/2025/02f098f1b1.jpg
---

This post follows directly on from my last, "A First Look at Visualising Data With R and ggplot2", so if you are new to ggplot2 check that one out first!

Today we are going to be continuing looking at the Palmer Archipelago dataset, this time for creating scatter plots.

As before the dataset being used can be downloaded directly (in csv format) from [Kaggle](https://www.kaggle.com/code/parulpandey/penguin-dataset-the-new-iris) or imported directly into R with the `palmerpenguins` package.

![Artwork by @allison_horst](https://asymptopic.com/uploads/2025/02f098f1b1.jpg)

Artwork by @allison_horst.

# Importing the Data

As previously we will be needing the `ggthemes` and `ggplot2` packages. This time we will also be using the `dplyr` package for data manipulation and the `ggExtra` package for plotting distributions.

```R
library(dplyr)
library(ggplot2)
library(ggthemes)
library(ggExtra)

penguins <- read.csv("penguins_size.csv")
```

Next we convert the 'species', 'island' and 'sex' variables to factors.

```R
penguins[c('species', 'island', 'sex')] <- 
  lapply(penguins[c('species', 'island', 'sex')], as.factor)
```

```R
penguins <- penguins |> na.omit() |>
  rename('Island' = 'island', 'Species' = 'species', 'Sex' = 'sex') |>
  filter(!(Sex == "."))
```

# Simple Scatter

To create a basic scatter plot we can use `geom_point()`.

```R
penguins |>
  ggplot(aes(x = culmen_length_mm, y = culmen_depth_mm))+
  geom_point()
```

![Basic scatter](https://asymptopic.com/uploads/2025/basicscatter.png)

# Making Improvements

We can improve this plot by adding labels, colour and a theme.

```R
penguins |>
  ggplot(aes(x = culmen_length_mm, y = culmen_depth_mm))+
  geom_point(shape = 16, colour = "#FF4F00")+
  labs(x = "Culmen Length (mm)", y = "Culmen Depth (mm)", 
      title = "Culmen Length vs. Depth in Penguins in the Palmer Archipelago") +
  theme_hc() +
  geom_rangeframe()
```

![Improved scatter](https://asymptopic.com/uploads/2025/improved-scatter.png)

Looking at our plot it is clear that there appear to be some distinct clusters. Before investigating these, let's add a line of best fit with `geom_smooth(method="lm")`.

```R
penguins |>
  ggplot(aes(x = culmen_length_mm, y = culmen_depth_mm))+
  geom_point(shape = 16, colour = "#FF4F00")+
  labs(x = "Culmen Length (mm)", y = "Culmen Depth (mm)",
      title = "Culmen Length vs. Depth in Penguins in the Palmer Archipelago") +
  geom_smooth(method="lm")+
  theme_economist_white()+
  geom_rangeframe()

print(cor(penguins$culmen_depth_mm, penguins$culmen_length_mm))
```

![Trend scatter](https://asymptopic.com/uploads/2025/trend-scatter.png)

Output:
```
-0.2286256
```

# Marginal Plots

We can add marginal plots with `ggMarginal` from the `ggExtra` package to show the distribution of the data.

```R
plot <- penguins |>
        ggplot(aes(x = culmen_length_mm, y = culmen_depth_mm))+
        geom_point(shape = 16, colour = "#FF4F00")+
        labs(x = "Culmen Length (mm)", y = "Culmen Depth (mm)",
            title = "Culmen Length vs. Depth in Penguins in the Palmer Archipelago") +
        geom_smooth(method="lm")+
        theme_calc()

ggMarginal(plot, type="histogram", fill = "#FF4F00", size=5, bins = 12)
```

![Marginal histogram](https://asymptopic.com/uploads/2025/marginal-scatter.png)

```R
ggMarginal(plot, type="boxplot", fill = "#FF4F00", size=15)
```

![Marginal boxplot](https://asymptopic.com/uploads/2025/marginalbox.png)

```R
ggMarginal(plot, type="density", fill = "#FF4F00", size=10)
```

![Marginal density](https://asymptopic.com/uploads/2025/marginaldensity.png)

# Investigating Clustering

To investigate the clusters we can add `colour = Species` to `aes`.

```R
penguins |>
  ggplot(aes(x = culmen_length_mm, y = culmen_depth_mm, colour = Species))+
  geom_point(shape = 16)+
  labs(x = "Culmen Length (mm)", y = "Culmen Depth (mm)",
      title = "Culmen Length vs. Depth by Species") +
  geom_smooth(method="lm")+
  scale_fill_few()+
  theme_few()
```

![Species clusters](https://asymptopic.com/uploads/2025/multiple-lms.png)

```R
correlation <- penguins |>
  group_by(Species) |>
    summarise(correlation = cor(culmen_length_mm, culmen_depth_mm))

print(correlation)
```

Output:
```
Species    correlation
Adelie     0.3858132
Chinstrap  0.6535362
Gentoo     0.6540233
```

```R
penguins |>
  ggplot(aes(x = culmen_length_mm, y = culmen_depth_mm, colour = Island))+
  geom_point(shape = 16)+
  labs(x = "Culmen Length (mm)", y = "Culmen Depth (mm)",
      title = "Culmen Length vs. Depth by Island") +
  geom_smooth(method="lm")+
  theme_foundation()
```

![Island clusters](https://asymptopic.com/uploads/2025/improvedmult.png)

```R
penguins |>
  ggplot(aes(x = culmen_length_mm, y = culmen_depth_mm, colour = Sex))+
  geom_point()+
  labs(x = "Culmen Length (mm)", y = "Culmen Depth (mm)",
      title = "Culmen Length vs. Depth by Sex") +
  geom_smooth(method="lm")+
  theme_solarized()
```

![Sex plot](https://asymptopic.com/uploads/2025/sexplot.png)

```R
penguins |>
  ggplot(aes(x = culmen_length_mm, y = culmen_depth_mm, colour = Sex, shape=Species))+
  geom_point()+
  labs(x = "Culmen Length (mm)", y = "Culmen Depth (mm)",
      title = "Culmen Length vs. Depth by Sex and Species") +
  geom_smooth(method="lm")+
  theme_excel_new()
```

![Sex and species](https://asymptopic.com/uploads/2025/sexandspecies.png)

# Facet Plots

```R
ggplot(penguins, aes(x=culmen_length_mm, y = culmen_depth_mm, colour = Species))+
  geom_point()+
  geom_smooth(method="lm")+
  facet_grid(Island~Species, scales="free", space="free_x") + 
  labs(x="Culmen Length (mm)", y="Culmen Depth (mm)",
       title="Culmen Length vs Depth by Species and Island")+
  theme_base()
```

![Facet by island and species](https://asymptopic.com/uploads/2025/ffacetfirst.png)

```R
ggplot(penguins, aes(x=culmen_length_mm, y = culmen_depth_mm, colour = Sex))+
  geom_point()+
  geom_smooth(method="lm")+
  facet_grid(Sex~Species, scales="free", space="free_x") + 
  labs(x="", y="Penguin Count",
       title="Culmen Length vs Depth by Species and Sex")+
  theme_stata()
```

![Facet by sex and species](https://asymptopic.com/uploads/2025/marginalsexspecies.png)

# Conclusion

I hope that this post has been a useful introduction to scatter plots with ggplot2. Why not try investigating the relationships between some of the other numeric variables for this data such as body mass or flipper length?