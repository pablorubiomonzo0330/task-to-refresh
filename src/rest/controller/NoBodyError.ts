export default class NoBodyError extends Error{
    private STATUS: number = 400
    constructor(message:string) {
        super(message);

    }

}