import {MongoClient, MongoServerSelectionError} from "mongodb";

export  class DatabaseClientProvider{
    private static mongoClient?: MongoClient
    public static DATABASE_NAME = "ShipmentsDB"
    public static COLLECTION_NAME = "shipmentsCollection"

    public static async initConnection(appName = "shipments-rest-api"){
        if (!DatabaseClientProvider.getMongoClient()){
            try{
                 await DatabaseClientProvider.initConnectionInternal(appName)
            } catch (error) {
                if (error instanceof MongoServerSelectionError){
                    await DatabaseClientProvider.closeDbConnection()
                    await DatabaseClientProvider.initConnectionInternal(appName)
                }
                else {
                    throw error
                }
            }
        }
        return;

    }

    public static async initConnectionInternal(appName: string){
        DatabaseClientProvider.mongoClient = new MongoClient(`mongodb://${process.env.ENVIRONMENT || "localhost"}:27017`, {appName})
        return await DatabaseClientProvider.mongoClient.connect()
    }

    public static getMongoClient(){
        return DatabaseClientProvider.mongoClient
    }

    public static async closeDbConnection(){
        const client = DatabaseClientProvider.getMongoClient()
        if (client){
            await client.close(true)
            DatabaseClientProvider.mongoClient = undefined
        }
    }
}