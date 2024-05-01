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

# Tech Stack
## Frontend
The frontend is a standard TypeScript/Javascript React SPA. It makes calls to our backend over HTTP, making read requests via our API library and caching layer.

## Backend
The backend is a Java Spring Boot application. It performs some pretty basic data handling to retrieve and update documents in MongoDB.

# Management Tools

* [Kanban Board](https://github.com/orgs/spe-uob/projects/113)
* [Gantt Chart](https://github.com/spe-uob/2023-CityFarm/raw/dev/Gantt%20Chart.xlsx)

# Development Resources

* [ERD](https://tinyurl.com/erddraft)

## Development Instructions

### Requirements
- JDK 21
- Docker

### Usage

- Run a MongoDB container (`docker run --name mongodb -p 27017:27017 mongo`)
- Run `mvn spring-boot:run` in `cityfarm` to bring up the backend
- Run `npm start` in `cityfarmreact` to bring up the frontend
- Website available at http://localhost:3000

# Deployment
## Continuous Deployment during development
We have a GitHub action that builds docker containers for all the components and calls a webhook on a server that restarts the Docker Compose configuration.
## Production
For production on an actual server, just run `docker compose up -d` in the `continuous-deployment` folder. You'll want a reverse proxy to make the frontend and backend available over HTTPS on the same domain. You'll need to change the backend address in the Docker Compose file.

Additionally, the entire app can be setup to run on a Windows desktop (only available on the same network). Running `install.bat` will install the app under WSL2 and bring it up every boot. It will then open the appropriate page.