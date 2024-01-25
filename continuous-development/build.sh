#!/bin/sh
cd cityfarm
SPRING_DATA_MONGODB_HOST="mongodb://mongodb:27017" mvn package spring-boot:repackage
docker build -t ghcr.io/spe-uob/2023-cityfarm/backend:dev .
docker push ghcr.io/spe-uob/2023-cityfarm/backend:dev

cd ../cityfarmreact
docker build -t ghcr.io/spe-uob/2023-cityfarm/frontend:dev .
docker push ghcr.io/spe-uob/2023-cityfarm/frontend:dev

cd ../mongodb
docker build -t ghcr.io/spe-uob/2023-cityfarm/mongodb:latest .
docker push ghcr.io/spe-uob/2023-cityfarm/mongodb:latest