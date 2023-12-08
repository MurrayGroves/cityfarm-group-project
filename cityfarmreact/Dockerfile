FROM node:18-alpine

WORKDIR /app/

# Copy app from host environment into image
COPY public/ /app/public
COPY src/ /app/src
COPY package.json /app/

# Install dependencies
RUN npm install

CMD ["npm", "start"]