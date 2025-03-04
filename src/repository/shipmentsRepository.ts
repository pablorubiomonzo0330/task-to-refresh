import {Collection, ObjectId} from "mongodb";
import {DatabaseClientProvider} from "./databaseClientProvider";
import {Shipment} from "./models";
import {randomUUID} from "node:crypto";
import ShipmentRepositoryError from "./ShipmentRepositoryError";


export default class ShipmentsRepository{
    private  collection: Collection;

    constructor(private client = DatabaseClientProvider.getMongoClient()){
        if (this.client){
            this.collection = this.client.db(DatabaseClientProvider.DATABASE_NAME).collection(DatabaseClientProvider.COLLECTION_NAME)
        } else {
            throw new Error("Database client is not available")
        }
    };

    public async getAllShipments(): Promise<Shipment[]> {
        const shipments =  await this.collection.find({}).toArray()

        return shipments.map(shipment => {
            return {
                shipmentId: shipment.shipmentId,
                states: shipment.states,
                trackingKey: {
                    carrier: shipment.trackingKey.carrier,
                    trackingNumber: shipment.trackingKey.trackingNumber
                },
                createdAt: shipment.createdAt
            } as Shipment
        })
    }

    public async getShipmentById(shipmentId: string): Promise<Shipment> {
        return await this.collection.findOne({shipmentId: shipmentId}).catch((error): any => {
            throw new ShipmentRepositoryError(`The shipment with id: ${shipmentId} could not be found`)
        }) as Shipment
    }

    public async createShipment(shipment: Shipment){
        shipment.shipmentId = randomUUID()

        const savedShipment =  await this.collection.insertOne(shipment)
        console.log("after saving")
        if (!savedShipment.insertedId){
            throw new ShipmentRepositoryError("The shipment could not be saved in the database");
        }

        return savedShipment.insertedId
    }

    public async deleteShipmentWithId(shipmentId: string) {
        return await this.collection.deleteOne({"shipmentId": shipmentId})
    }
};