FROM node:22
WORKDIR /code
COPY package*.json .
RUN npm install
RUN npm install -g nodemon ts-node
ENV MONGODB_PORT=27017
COPY . .
EXPOSE 3000
 CMD ["nodemon", "./src/rest/server.ts"]