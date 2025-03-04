import {Kafka, KafkaConfig} from "kafkajs";

export default class KafkaClient {
    public static kafkaClient: Kafka | undefined = undefined

    public static getKafkaClient(){
        return KafkaClient.kafkaClient
    }

    public static configureKafkaClient(kafkaConfig: KafkaConfig){
        KafkaClient.kafkaClient = new Kafka(kafkaConfig)
        return KafkaClient.kafkaClient
    }

}