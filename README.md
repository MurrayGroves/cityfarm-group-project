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
## Livestock Manager
As the livestock manager for Windmill Hill farm I need to be able to keep track of the many many tasks and animals I have to keep track of. I want everything in one easy-to-access place so I can share it with our volunteers.

## Volunteer
As a volunteer at Windmill Hill farm, I'm not super experienced at the work we do, and I am not familiar with the complicated excel sheet setup they use now. I need a simple system where I can easily understand what tasks I need to do - and update them as I complete them.

## CEO
As CEO of Windmill Hill farm I sometimes need to be able to see an overview of all our animals and what events are coming up so I can help organise the equipment and people that are needed. Right now I have to ask the Livestock Manager because I don't understand his Excel spreadsheet system. Having a website with all the information in would make this much quicker.

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
