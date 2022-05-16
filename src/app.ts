/*
    Set environment variables
*/
import "dotenv/config";

/*
    Sequelize setup
*/
import { initSequelize } from "./utils/helper";

// Create instance of sequelize database connection
export const sequelizeInstance = initSequelize();

// Connect to and setup the database
sequelizeInstance
    .authenticate()
    .then(() => {
        setupDatabase(sequelizeInstance).then(() =>
            console.log("Database setup finised")
        );
    })
    .catch((err: any) => {
        console.error("Unable to connect to the database:", err);
    });

/*
    Express App setup
*/
import { Application } from "express";
import express = require("express");
import cors = require("cors");
import formidable = require("express-formidable");

const app: Application = express();

app.use(express.json({ limit: "1000mb" }));
app.use(
    express.urlencoded({
        limit: "1000mb",
        extended: true,
    })
);
app.use(cors());

/*
    Routing
*/

import users = require("./routes/users.router");
import login = require("./routes/login.router");
import articles = require("./routes/articles.router");
import files = require("./routes/files.router");
import tags = require("./routes/tags.router");

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use("/users", users.router);
app.use("/login", login.router);
app.use("/files", files.router);
app.use("/tags", tags.router);
app.use("/articles", articles.router);

/*
    ssl setup
*/
import fs = require("fs");
import https = require("https");

const ssl = {
    key: fs.readFileSync("./certificate/key.pem"),
    cert: fs.readFileSync("./certificate/cert.pem"),
};
const httpsServer = https.createServer(ssl, app);
const port: number = 8080;

httpsServer.listen(port);
console.log("API URL: https://localhost:" + port);

/*
    Swagger setup
    based on https://github.com/Surnet/swagger-jsdoc/blob/master/examples/app/app.js
*/

import swaggerJsdoc = require("swagger-jsdoc");
import swaggerUi = require("swagger-ui-express");
import { setupDatabase } from "./database/database";

const swaggerEndPoint: string = "/api-docs/";
const swaggerDefinition = {
    info: {
        title: "Teaching Articles API",
        swagger: "2.0",
        version: "0.0.1",
        description:
            "Backend API for fetching and creating articles about programming within different subjects",
    },
    servers: [
        {
            url: "https://localhost:${port}",
        },
    ],
};

const swaggerOptions = {
    swaggerDefinition,
    apis: ["./src/*/*.ts", "./outdir/*/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(swaggerEndPoint, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log("API Doc: https://localhost:" + port + swaggerEndPoint);
