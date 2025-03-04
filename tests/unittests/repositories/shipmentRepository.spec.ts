import {Collection, MongoClient} from "mongodb";
import {MongoDBContainer, StartedMongoDBContainer} from "@testcontainers/mongodb";
import {DatabaseClientProvider} from "../../../src/repository/databaseClientProvider";
import ShipmentsRepository from "../../../src/repository/shipmentsRepository";
import {randomUUID} from "node:crypto";
import {Shipment} from "../../../src/repository/models";

interface ShipmentTest{
    shipmentId: string,
    trackingKey: {
        carrier: string,
        trackingNumber: string
    },
    states: [],
    createdAt: string
}

describe("Test suite for the shipmentRepository", () => {
    jest.setTimeout(30000)
    let client: MongoClient;
    let db;
    let collection: Collection;
    let container: StartedMongoDBContainer;
    let shipmentRepository: ShipmentsRepository;
    let shipmentTest: ShipmentTest;
    beforeEach(async () => {
        container = await new MongoDBContainer().start()
        const uri = container.getConnectionString()
        client = new MongoClient(uri, {directConnection: true})
        await client.connect()
        db = client.db("test-db")
        collection = db.collection("test-collection")
        shipmentTest =  {
            "shipmentId": randomUUID(),
            "trackingKey": {
                "carrier": "DHL",
                    "trackingNumber": "00234340394"
            },
            "states": [],
                "createdAt": "2023-11-02T11:38:45Z"
        }
        await collection.insertOne(shipmentTest)
        console.log(`test shipment inserted, shipment: ${shipmentTest.shipmentId}`)
        DatabaseClientProvider['getMongoClient'] = jest.fn(() => {return client})
        DatabaseClientProvider['DATABASE_NAME'] = "test-db"
        DatabaseClientProvider['COLLECTION_NAME'] = "test-collection"
        shipmentRepository = new ShipmentsRepository(client)
    })

    afterEach(async () => {
        await client.close()
        await container.stop()
    })

    test("retrieves the shipments from the db", async () => {
        //given

        //when
        const shipments = await shipmentRepository.getAllShipments()
        //then
        expect(shipments.length).toBeGreaterThan(0)
    })

    test("retrieves a specific shipment from the db", async () => {
        //given

        //when
        const shipment = await shipmentRepository.getShipmentById(shipmentTest.shipmentId)
        //then
        expect(shipment.shipmentId).toEqual(shipmentTest.shipmentId)
    })

    test("saves shipment in database", async () =>{
        //given
        const request = {
            body: {
                "shipmentId": randomUUID(),
                "trackingKey": {
                    "carrier": "DHL",
                    "trackingNumber": "00234340394"
                },
                "states": [],
                "createdAt": new Date().toISOString()
            } as Shipment
        }

        //when
        const insertedId = await shipmentRepository.createShipment(request.body)
        const retrievePreviouslyInsertedShipment = await collection.findOne({_id: insertedId}) as unknown as Shipment

        //then
        expect(request.body.shipmentId).toEqual(retrievePreviouslyInsertedShipment.shipmentId)
    })

    test("deletes a shipment from the database", async () => {
        //given
        const shipmentId = shipmentTest.shipmentId
        //when

        await shipmentRepository.deleteShipmentWithId(shipmentId)
        const shipment = await collection.findOne({shipmentId})
        //then
        expect(shipment).toBe(null)
    })
})