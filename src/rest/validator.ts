import  * as ShipmentSchema from "../schemas/shipment-save-in-database.json"
import {validate} from "jsonschema"
import ValidationError from "./VaidationError";
import {Shipment} from "../repository/models";
import KafkaProducer from "../messaging/kafkaProducer";

export default class Validator{

    public static async validateShipmentSchema(shipment: Shipment){
        const errors =  validate(shipment, ShipmentSchema).errors
        const reasons = errors.map((error: Error) => error.stack)
        if (reasons && reasons.length > 0){
            const kafkaProducer = new KafkaProducer()
            await kafkaProducer.postMessageInTopic(`Tried to save shipment with wrong fields in the database, posting it in DLQ. Shipment => ${JSON.stringify(shipment)}`, "shipments-dlq")
            throw new ValidationError(reasons.toString())
        }
    }

}