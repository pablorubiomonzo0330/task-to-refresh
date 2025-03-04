import * as log4js from "log4js";

export const configureLogger = () => {
    log4js.configure({
        appenders: {
            shipment: { type: "fileSync", filename:"shipmentsLogs.log" },
            errors: { type: "fileSync", filename: "errors.log"}
        },
        categories: {
            default: { appenders: ["shipment"], level: "DEBUG" },
            errors: { appenders: ["errors"], level: "ERROR"}
        },
    });
    console.log("logger configured correctly")
};

