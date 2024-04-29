FROM node:18-alpine

WORKDIR /app/

RUN npm install -g serve

# Copy app from host environment into image
COPY public/ /app/public
COPY src/ /app/src
COPY package.json /app/

ENV BROWSER=none

LABEL org.opencontainers.image.source https://github.com/spe-uob/2023-CityFarm

# Install dependencies
RUN npm install
RUN npm run build

CMD ["serve", "-s", "build"]