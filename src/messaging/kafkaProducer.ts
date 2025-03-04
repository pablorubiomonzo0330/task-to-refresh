import KafkaClient from "./kafkaClient";
import {kafkaClientConfig} from "../appconfig/kafkaClientConfig";
import {Producer} from "kafkajs";

export default class KafkaProducer{
    public kafkaProducer: Producer

    constructor(private kafkaClient = KafkaClient.getKafkaClient()){
        if(kafkaClient){
            this.kafkaProducer = kafkaClient.producer()
        } else {
            console.log("error here")
            this.kafkaProducer = KafkaClient.configureKafkaClient(kafkaClientConfig).producer()
        }
    }

    public async postMessageInTopic(message: string, topic = "kafka-shipments"){
        await this.kafkaProducer.connect()
        await this.kafkaProducer.send({
            topic: topic,
            messages: [
                {
                    value: message
                }
            ]
        })

        console.log(`message posted in the topic: ${topic}`)

        await this.kafkaProducer.disconnect()
    }


}