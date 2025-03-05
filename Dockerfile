FROM node
WORKDIR /code
COPY package*.json .
RUN npm install
RUN npm install -g nodemon ts-node
ENV MONGODB_PORT=27017 ENVIRONMENT=mongodb KAFKA_1=kafka-broker-1 KAFKA_2=kafka-broker-2 KAFKA_3=kafka-broker-3 KAFKA_PORT_1=9091 KAFKA_PORT_2=9092 KAFKA_PORT_3=9093
COPY . .
EXPOSE 27017
CMD ["sh", "-c", "docker-compose up & nodemon ./src/messaging/kafkaConsumer.ts & nodemon ./src/rest/server.ts & nodemon ./src/messaging/kafkaDLQConsumer.ts & wait"]