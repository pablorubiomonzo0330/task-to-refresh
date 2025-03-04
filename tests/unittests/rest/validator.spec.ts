import Validator from "../../../src/rest/validator";
import {Shipment} from "../../../src/repository/models";
import {randomUUID} from "node:crypto";

jest.mock("../../../src/messaging/kafkaProducer")
describe("Test suite for the validator", () => {
    test("the validator doesn´t throw an error when called with a correct body", () => {
        //given
        const request = {
            body: {
                "shipmentId": randomUUID(),
                "trackingKey": {
                    "carrier": "DHL",
                    "trackingNumber": "00234340394"
                },
                "states": [],
                "createdAt": new Date().toISOString().split('.')[0]+'Z'
            } as Shipment
        }
        //when
        //then
        expect(() => Validator.validateShipmentSchema(request.body)).not.toThrow()
    })

    test("throws an error when being called with a shipment with a wrong schema", () => {
        //given
        const requestWithWrongBody = {
            body: {
                "shipmentId": randomUUID()
            }
        }
        //then
        expect(() => Validator.validateShipmentSchema(requestWithWrongBody.body)).rejects.toThrow()
    })
})