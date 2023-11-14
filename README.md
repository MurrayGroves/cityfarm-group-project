# 2023-City Farm

# Project Description

The aim is to create a virtual system which can be accessed remotely by different farmers and can provide an accessible interface to log livestock data such as movements, age, heritage, enclosure etc so that farmers can coordinate dates and their livestock more easily to avoid clashes.

# Stakeholders

The stakeholders of this project are the livestock manager and livestock assistants at the following farms:

* Windmill Hill City Farm
* Hartcliffe City Farm
* St Werburghs City Farm

# User Stories

As the livestock manager of three city farms, I would like a system that automates the input of specific dates and relevant animal data into a calendar, so that I can spend time managing other areas of my work.

As the livestock manager of St Werburgh's city farm I would like to move my newly bred pigs to windmill hill city farm but I am not sure whether there is enough space within their pens and this is urgent so I can't wait for a response due to having too many pigs within our own current pens. So I need a way to quickly check if there is capacity at my chosen farm and if not where else could I put this pig.

As the livestock manager for Windmil Hill I am looking to change our current vaccine choice for cows to a more up to date one so I need to know how that would affect the timelines of how often the animals get a jab since our schedule is already tight.

As the chef within St Werburgh's I need to able to quickly see when the chicken lay eggs and how many are expected each week so I can update my weekly supply order on the fly easily.

As the livestock manager for both St Werburgh's and Windmill Hill I need to be able to intergrate both of the animal calendars within one so I don't need to keep switching between the two because otherwise I'd just use paper and my head instead of the calendar.

As the events coordinator for the city farm I want to able to see when a goat will arrive into windmill hill since I have planned a goat-themed event for 3 weeks time and am worried that the innoculation slots for the goats will cut it slim so I need to know how much leeway the animals have before moving.

I am the animal breeder for a city farm outside of the 3 city farm trust and I would like to trade two chickens for a rooster with St werburghs so the city farm app will need to be able to quickly update the datbase within itself in order to maintain a constant balance and make sure it's protected so there's no dupulicate removal or addition to the databse in case two people change the numbers at onece. 

Since there is a powercut at the farm as the livestock mnagaer I want to do an inventory of all our animals to check they're all okay with the powercut so I have got the webapp up on my phone and am using it to check all the pen levels; so the webapp must always be up to date in terms of its database and must be phone compatible because desktops can't be used in this situation.



# Management Tools

* [Kanban Board](https://github.com/orgs/spe-uob/projects/113)
* [Gantt Chart](https://github.com/spe-uob/2023-CityFarm/raw/dev/Gantt%20Chart.xlsx)

# Development Resources

* [ERD](https://tinyurl.com/erddraft)

## Development Installation

### Requirements

- JDK 20

- [Docker Compose](https://docs.docker.com/compose/install/)

### Usage

- Run `docker compose up -d` to bring up MongoDB

- Run `CityFarmApplication` within IntelliJ

- App available at http://localhost:8080