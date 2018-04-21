# base image
FROM node:9.11-alpine

# copy files
COPY package.json /src/package.json
COPY info.js /src/info.js
COPY server.js /src/server.js

# install libs
RUN cd /src/ && npm install

# run application
CMD cd /src/ && node server.js
