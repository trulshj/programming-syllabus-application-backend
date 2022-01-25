import { Application, response } from "express";
const express = require("express");
const app: Application = express();
const port: number = 8080;
const routes: any = require("./routerTopLevel");
const swaggerJsdoc = require("swagger-jsdoc");
const baseAPI: string = "/api";
const swaggerEndPoint: string = "/api-docs/";
const Sequelize = require("sequelize");
const cors = require("cors");
require("dotenv").config();
const fs = require("fs");
const bodyparser = require("body-parser");
app.use(bodyparser.json({ limit: "1000mb" }));
app.use(
    bodyparser.urlencoded({
        limit: "1000mb",
        extended: true,
        parameterLimit: "10000",
    })
);
app.use(cors());

//ssl-setup
const https = require("https");
const ssl = {
    key: fs.readFileSync("./certificate/key.pem"),
    cert: fs.readFileSync("./certificate/cert.pem"),
    port: port,
};
https.createServer(ssl, app).listen(port, () => {
    console.log("Backend started");
    console.log("API: https://localhost:" + port + swaggerEndPoint);
});

// Sequelize database connection
const sequlize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_URL,
        dialect: process.env.DATABASE_DIALECT,
        logging: process.env.QUERY_LOG == "true",
    }
);
// generating database
sequlize
    .authenticate()
    .then(() => {
        const database = require("./database/database");
        database()
            .setup(sequlize)
            .then(() => console.log("Database setup finised"));
    })
    .catch((err: any) => {
        console.error("Unable to connect to the database:", err);
    });

// swagger js-dock
// setup based on https://github.com/Surnet/swagger-jsdoc/blob/master/examples/app/app.js

const swaggerDefinition = {
    info: {
        // API informations (required)
        title: 'Backend API for "name of produckt"', // Title (required),
        swagger: "2.0",
        version: "0.0.1", // Version (required)
        description: "Backend api for bachelor", // Description (optional)
    },
    servers: [
        {
            url: "https://localhost:${port}",
        },
    ],
    basePath: baseAPI, // Base path (optional)
};

// Options for swagger docs
const options = {
    // Import swaggerDefinitions
    swaggerDefinition,
    // Path to the API docs
    // Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
    //Search every folder inside /src folder and read all ts(typescript files)
    apis: ["./src/*/*.ts", "./outdir/*/*.js"],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJsdoc(options);

// swagger server using swagger-ui-express
const swaggerUi = require("swagger-ui-express");
app.use(swaggerEndPoint, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//router for the rest of the api-endpoints
routes(app, baseAPI, sequlize);
