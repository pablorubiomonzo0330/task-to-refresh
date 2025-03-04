import {Request, Response, NextFunction, Router} from "express"
import RestController from "../controller/restController"

export const router = Router()
const controller = new RestController()
console.log("starting router")
router.get("/", (req: Request, res: Response, next: NextFunction) => controller.getAllShipments(req, res, next))
router.get("/shipments/:shipmentId", (req: Request, res: Response, next: NextFunction) => controller.getSpecificShipment(req, res, next))
router.post("/shipments", (req: Request, res: Response, next: NextFunction) => controller.createNewShipment(req, res, next))
router.delete("/shipments", (req: Request, res: Response, next: NextFunction) => controller.deleteShipmentWithId(req, res, next))