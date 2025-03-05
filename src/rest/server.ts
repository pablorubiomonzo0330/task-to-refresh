import express, {Request, Response, NextFunction} from "express";
import {router} from "./router/restRouter";
import {DatabaseClientProvider} from "../repository/databaseClientProvider";
import ValidationError from "./VaidationError";
import {getLogger} from "log4js";
const appExpress = express()
const logger = getLogger("errors")
appExpress.use(express.json());
appExpress.use(router)
appExpress.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError){
        logger.error(err.message)
        res.status(err.STATUS).send(err.message)
    } else {
        res.status(500).send(err.message)
    }
})

appExpress.listen(3000, async () => {
    try{
        await DatabaseClientProvider.initConnection()
    } catch(error: any){
        logger.fatal(`Fatal error: ${error.stack? error.stack : error.toString()}`)
    }
})