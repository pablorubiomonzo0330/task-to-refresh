FROM node
WORKDIR /code
COPY package*.json .
RUN npm install
RUN npm install -g nodemon ts-node
ENV MONGODB_PORT=27017 ENVIRONMENT=mongodb
COPY . .
EXPOSE 27017
CMD ["sh", "-c", "docker-compose up & nodemon ./src/messaging/kafkaConsumer.ts & nodemon ./src/rest/server.ts & nodemon ./src/messaging/kafkaDLQConsumer.ts & wait"]