import {Consumer, Kafka} from "kafkajs";
import KafkaClient from "./kafkaClient";
import {kafkaClientConsumerConfig, kafkaClientConfig} from "../appconfig/kafkaClientConfig";

export default class KafkaConsumer{
    private kafkaConsumer: Consumer

    constructor(private topic = "kafka-shipments", private kafkaClient = KafkaClient.getKafkaClient()){
        if (kafkaClient){
            this.kafkaConsumer = kafkaClient.consumer(kafkaClientConsumerConfig)
        } else {
            this.kafkaConsumer = KafkaClient.configureKafkaClient(kafkaClientConfig).consumer(kafkaClientConsumerConfig)
        }
    }

    public async readMessagesFromTopic(){
        await this.kafkaConsumer.connect()
        console.log("connected")
        await this.kafkaConsumer.subscribe({topic: this.topic, fromBeginning: true})
        console.log("subscribed")
        await this.kafkaConsumer.run({
            eachMessage: async ({ topic, partition, message}) => {
                console.log({
                    value: message.value?.toString()
                }, `${message}`)
            }
        })
        console.log(`messages read from topic: ${this.topic}`)
    }
}

new KafkaConsumer().readMessagesFromTopic().catch(error => console.log(error))