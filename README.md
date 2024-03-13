# 2023-City Farm
[![Java CI with Maven](https://github.com/spe-uob/2023-CityFarm/actions/workflows/maven.yml/badge.svg?branch=dev)](https://github.com/spe-uob/2023-CityFarm/actions/workflows/maven.yml)

# Project Description

The aim is to create a virtual system which can be accessed remotely by different farmers and can provide an accessible interface to log livestock data such as movements, age, heritage, enclosure etc so that farmers can coordinate dates and their livestock more easily to avoid clashes.

# Stakeholders

The stakeholders of this project are the livestock manager and livestock assistants at the following farms:

* Windmill Hill City Farm
* Hartcliffe City Farm
* St Werburghs City Farm

# User Stories

As a livestock manager, I want to view animal capacities at different farms, so that I can quickly check if there's space before moving an animal. (This avoids overcrowding and ensures animal welfare.)

As a livestock manager, I want to create recurring vaccination events for new vaccines, so that I can keep track of updated schedules. (This ensures animal health and avoids missed vaccinations.)

As a chef, I want to see upcoming egg production forecasts, so that I can adjust my weekly supply orders. (This reduces waste and ensures fresh ingredients.)

As a livestock manager, I want to see a combined calendar for all farms, so that I can avoid switching between them. (This saves time and simplifies animal management.)

As an event coordinator, I want to view goat arrival dates, so that I can plan events around their inoculations. (This ensures animal health and avoids scheduling conflicts.)

As an animal breeder, I want to securely trade animals with other farms within the app, so that I can facilitate collaboration and resource sharing.

As a livestock manager, I want to access animal data and inventory on my phone during power outages, so that I can ensure animal well-being even when computers are unavailable.

# Project Structure 
## Spring boot
Spring boot is our front-end hosting framework, it allows us to host our webpages and link them to our java backend, it is what's used to get all the internal http requests and then send them on to the server as well as providing the structure for how the actual pages are laid out.
### ThymeLeaf
A special mention to thymeleaf, which is a spring boot library. It provides an incredibly useful templating features for formatting the actual front-end pages as well as providing actual means to return and index the pages to the java back-end.
## React 
React is a web front-end javascript library, it is used to make easy to design and clean looking buttons that also provide markup for holding and hosting text that is easily read by the user.
## MongoDB
Mongo DB is our database back-end language, it allows for easy intergration within java which makes the elements incredibly easy to access and manipulate in an object oriented fashion. The flexibility of Mongo allows us to quickly and easily add and edit animals to the database without having to adjust the entire schema of the setup.
## Java
All our calculations and backend legic is done within java since it is increadibly easy to then interface with both our database and web frontend due to its object oriented nature allowing us to store tables and records as classes along with doing the same for individual pages for the react files.


# Management Tools

* [Kanban Board](https://github.com/orgs/spe-uob/projects/113)
* [Gantt Chart](https://github.com/spe-uob/2023-CityFarm/raw/dev/Gantt%20Chart.xlsx)

# Development Resources

* [ERD](https://tinyurl.com/erddraft)

## Development Installation

### Requirements

- JDK 21

- [Docker Compose](https://docs.docker.com/compose/install/)

### Usage

- Run `docker compose up -d` to bring up MongoDB

- Run `CityFarmApplication` within IntelliJ

- App available at http://localhost:8080
