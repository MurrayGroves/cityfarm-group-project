FROM node:18-alpine


WORKDIR /app/

RUN npm install -g serve

# Copy app from host environment into image
COPY public/ /app/public
COPY package.json /app/

ENV BROWSER=none

LABEL org.opencontainers.image.source https://github.com/spe-uob/2023-CityFarm

# Install dependencies
RUN npm install
COPY src/ /app/src
ARG BASE_URL=
ENV REACT_APP_BASE_URL=$BASE_URL
RUN npm run build

CMD ["serve", "-s", "build"]