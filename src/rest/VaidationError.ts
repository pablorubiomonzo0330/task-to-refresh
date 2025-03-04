export default class ValidationError extends Error{
    public STATUS: number = 400
    constructor(message: string){
        super(message)
    }
}