import {MongoDBContainer, StartedMongoDBContainer} from "@testcontainers/mongodb";
import {Collection, MongoClient} from "mongodb";
import {DatabaseClientProvider} from "../../../src/repository/databaseClientProvider";
import ShipmentService from "../../../src/domain/shipmentService";
import {Shipment} from "../../../src/repository/models";
import {randomUUID} from "node:crypto";
describe("test suite for the shipmentService", () => {
    jest.setTimeout(50000)

    let client: MongoClient;
    let db;
    let collection: Collection;
    let container: StartedMongoDBContainer;
    let shipmentService: ShipmentService;
    let testShipment: Shipment
    beforeEach(async () => {
        container = await new MongoDBContainer().start()
        const uri = container.getConnectionString()
        client = new MongoClient(uri, {directConnection: true})

        await client.connect()
        db = client.db("test-db-shipment-service")
        collection = db.collection("test-collection-shipment-service")
        DatabaseClientProvider['getMongoClient'] = jest.fn(() => { return client })
        DatabaseClientProvider['DATABASE_NAME'] = "test-db-shipment-service"
        DatabaseClientProvider['COLLECTION_NAME'] = "test-collection-shipment-service"

        testShipment = {
            "shipmentId": randomUUID(),
            "trackingKey": {
                "carrier": "DHL",
                "trackingNumber": "00234340394"
            },
            "states": [],
            "createdAt": "2023-11-02T11:38:45Z"
        } as Shipment
        await collection.insertOne(testShipment)
        shipmentService = new ShipmentService()
    })

    afterEach(async () => {
        await client.close()
        await container.stop()
    })

    test("retrieves shipments successfully from the database", async () => {
        //given

        //when
        const shipments = await shipmentService.getAllShipmentsService()
        //then
        expect(shipments.length).toBeGreaterThan(0)
    })

    test("retrieves a specific shipment successfully from the database", async () => {
        //given
        const shipmentId = testShipment.shipmentId

        //when
        const shipment = await shipmentService.getShipmentByIdService(shipmentId)
        //then
        expect(shipment.shipmentId).toEqual(testShipment.shipmentId)
    })

    test("saves a shipment successfully in the database", async () => {
        //given
        const request = {
            body: {
                "shipmentId": randomUUID(),
                "trackingKey": {
                    "carrier": "DHL",
                    "trackingNumber": "00234340394"
                },
                "states": [],
                "createdAt": "2023-11-02T11:38:45Z"
            }
        }
        //when
        await shipmentService.createShipmentService(request.body)
        const previouslySavedShipment = await collection.findOne({"shipmentId": request.body.shipmentId}) as unknown as Shipment

        //then
        expect(request.body.shipmentId).toEqual(previouslySavedShipment.shipmentId)
    })

    test("deletes an item successfull from the database", async () => {
        //given
        const shipmentIdToDelete = testShipment.shipmentId
        //when
        await shipmentService.deleteShipmentByIdService(shipmentIdToDelete)
        const shipment = await collection.findOne({shipmentIdToDelete})
        //then
        expect(shipment).toBe(null)
    })
})