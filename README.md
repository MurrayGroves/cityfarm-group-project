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

The livestock manager of three city farms would like a system that automates the input of specific dates and relevant animal data into a calendar, so that they can spend time managing other areas of their work. They would like to move their newly bred pigs to windmill hill city farm but they are not sure whether there is enough space within their pens and this is urgent so they can't wait for a response due to having too many pigs within our own current pens. So they need a way to quickly check if there is capacity at their chosen farm and if not where else could they put this pig. Our project solves this scenario by providing an interface for viewing capacities for different farms and enclosures, allowing the livestock manager to check capacities quickly before moving an animal.

The livestock manager would also like to change the current vaccine choice for cows to a more up to date one so they would need to know how that would affect the timelines of how often the animals get a jab since the schedule is very tight. This can be accommplished through our web app by allowing the user to create a new reocurring event for this new vaccine so that reminders are given accurately when the animals need to get a jab.

The chef within St Werburgh's needs to able to quickly see when the chicken lay eggs and how many are expected each week so they can update my weekly supply order on the fly easily. The web app will allow them to see when the next batch of eggs are expected and how many.

The livestock manager manages both St Werburgh's and Windmill Hill will need to be able to integrate both of the animal calendars within one so that they don't need to keep switching between the two because otherwise they could just resort to using paper and my head instead of the calendar. Eventually, the web app will have implementation to see all of the events for both farms and the event will have the associated farm attached.

The events coordinator for the city farm will want to able to see when a goat will arrive into windmill hill since they have planned a goat-themed event for 3 weeks time and are worried that the innoculation slots for the goats will cut it slim so they need to know how much leeway the animals have before moving. With our web app, they can view all of the dates associated with the goats and are able to plan events accordingly.

An animal breeder for a city farm outside of the 3 city farm trust would like to trade two chickens for a rooster with St werburghs so the city farm app will need to be able to quickly update the database within itself in order to maintain a constant balance and make sure it's protected so there's no dupulicate removal or addition to the database in case two people change the numbers at once.

There is a powercut at the farm and the livestock manager wants to do an inventory of all the animals to check they're all okay with the powercut so they have got the webapp up on my phone and are using it to check all the pen levels; so the webapp must always be up to date in terms of its database and must be phone compatible because desktops can't be used in this situation.

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
