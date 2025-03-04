export const kafkaClientConfig = {
    clientId: 'code-kafka',
    connectionTimeout: 3000,
    metadataMaxAge: 10000,
    retry:{
        initialRetryTime: 100,
        retries: 8
    },
    brokers: [
        `${process.env.KAFKA_1 || "localhost"}:${process.env.KAFKA_PORT_1 || "5021"}`,
        `${process.env.KAFKA_2 || "localhost"}:${process.env.KAFKA_PORT_2 || "5022"}`,
        `${process.env.KAFKA_3 || "localhost"}:${process.env.KAFKA_PORT_3 || "5023"}`]
}

export const kafkaClientConsumerConfig = {
    groupId: "shipments-group"
}