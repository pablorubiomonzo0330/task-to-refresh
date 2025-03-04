import {Request, Response, NextFunction} from "express";
import ShipmentService from "../../domain/shipmentService";
import Validator from "../validator";
import NoBodyError from "./NoBodyError";
import {getLogger} from "log4js";
import {configureLogger} from "../../appconfig/logger";
import KafkaProducer from "../../messaging/kafkaProducer";
configureLogger()
const logger = getLogger()

export default class RestController{
    constructor(){};

    public async getAllShipments(req: Request, res: Response, next: NextFunction){
        console.log("calling getAllShipments")
        try{
            logger.info("Called getAllShipments function in the controller")
            const shipments = await new ShipmentService().getAllShipmentsService()

            res.status(200).send(`Shipments retrieved ${JSON.stringify(shipments)}`)
        }catch (error){
            next(error)
        }
    }

    public async getSpecificShipment(req: Request, res: Response, next: NextFunction){
        logger.debug("Called getSpecificShipment function in the controller")

        const shipmentId = req.params["shipmentId"]
        if (!shipmentId){
            res.status(400).send("You have to give a shipmentId")
        }

        const shipment = await new ShipmentService().getShipmentByIdService(shipmentId)
        if (!shipment){
            res.status(404).send(`No shipment found with id: ${shipmentId}`)
        }

        res.status(200).send(`Shipment found -> ${shipment}`)
    }

    public async createNewShipment(req: Request, res: Response, next: NextFunction){
        logger.debug("Called createNewShipment function in the controller")

        try {
            if (Object.keys(req.body).length === 0){
                throw new NoBodyError("The request has no body in it")
            }
            await Validator.validateShipmentSchema(req.body)

            const shipmentId = await new ShipmentService().createShipmentService(req.body)
            if (!shipmentId){
                res.status(400).send("shipment could not be saved in database")
            }

            const kafkaProducer = new KafkaProducer()
            await kafkaProducer.postMessageInTopic("new shipment created in ShipmentsDB" + JSON.stringify(req.body))
            res.status(200).send(`Item saved in database`)
        } catch (error){
            next(error)
        }

    }

    public async deleteShipmentWithId(req: Request, res: Response, next: NextFunction){
        logger.debug("Called deleteShipmentWithId function in the controller")

        try{
            if (Object.keys(req.body).length === 0 || !req.body.shipmentId){
                throw  new NoBodyError("No body found on the request or shipmentId not included in it")
            }
            await new ShipmentService().deleteShipmentByIdService(req.body.shipmentId)
            const kafkaProducer = new KafkaProducer()
            await kafkaProducer.postMessageInTopic("shipment deleted from the ShipmentsDB " +  req.body.shipmentId)
            res.status(200).send("Shipment deleted from database")
        } catch (error){
            next(error)
        }
    }
}