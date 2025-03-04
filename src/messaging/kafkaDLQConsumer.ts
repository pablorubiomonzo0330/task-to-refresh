import KafkaConsumer from "./kafkaConsumer";

const kafkaDLQConsumer = new KafkaConsumer("shipments-dlq")

kafkaDLQConsumer.readMessagesFromTopic().catch(error =>{
    console.log(error)
})

