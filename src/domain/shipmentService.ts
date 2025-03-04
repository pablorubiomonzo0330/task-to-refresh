import ShipmentsRepository from "../repository/shipmentsRepository";
import {Shipment} from "../repository/models";

export default class ShipmentService{
    constructor(private shipmentRepository = new ShipmentsRepository()){};

    public async getAllShipmentsService(): Promise<Shipment[]>{
        return await this.shipmentRepository.getAllShipments()
    }

    public async getShipmentByIdService(shipmentId: string){
        return await this.shipmentRepository.getShipmentById(shipmentId)
    }

    public async createShipmentService(shipment: Shipment){
        return await this.shipmentRepository.createShipment(shipment)
    }

    public async deleteShipmentByIdService(shipmentId: string){
        return await this.shipmentRepository.deleteShipmentWithId(shipmentId)
    }

}