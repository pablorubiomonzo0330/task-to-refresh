export default class ShipmentRepositoryError extends Error {
    public STATUS: number = 404
    constructor(message: string) {
        super(message);
    }
}