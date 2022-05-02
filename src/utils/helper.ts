import { Sequelize } from "@sequelize/core";
import { randomBytes } from "crypto";

export function initSequelize() {
    return new Sequelize(
        process.env.DATABASE_NAME as string,
        process.env.DATABASE_USER as string,
        process.env.DATABASE_PASSWORD,
        {
            host: process.env.DATABASE_URL,
            dialect: "mysql",
            logging: process.env.QUERY_LOG == "true",
        }
    );
}

export function getRandomString(): string {
    return randomBytes(32).toString("hex");
}
