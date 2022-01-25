import DoneCallback = jest.DoneCallback;
import { Sequelize } from "sequelize";
import { IUser } from "../user/IUser";
const userFeatuer = require("../user/userFeatures");

jest.setTimeout(50000);
// Sequelize database connection
// @ts-ignore
const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_URL,
        dialect: process.env.DATABASE_DIALECT,
        logging: process.env.QUERY_LOG == "true",
    }
);
const database = require("../database/database");
beforeAll(async (done: DoneCallback) => {
    await sequelize.authenticate().then(async () => {
        await database()
            .setup(sequelize)
            .then(() => {
                done();
            });
    });
});

test("login a user", (done) => {
    const jestUser: IUser = {
        email: "user@user.com",
        password: "test",
        username: "",
    };

    userFeatuer.logInUser(jestUser, sequelize).then((res: any | undefined) => {
        expect(res).toBeDefined();
        expect(res.username).toBe("JestUser");
        done();
    });
}, 6000);

test("login:right user, wrong passowrd", (done) => {
    const jestUser: IUser = {
        email: "user@user.com",
        password: "test2",
        username: "",
    };
    userFeatuer
        .logInUser(jestUser, sequelize)
        .then()
        .catch((error: any) => {
            expect(error).toBeDefined();
            done();
        });
}, 6000);

test("login:wrong user, right passowrd", (done) => {
    const jestUser: IUser = {
        email: "user2@user.com",
        password: "test2",
        username: "",
    };
    userFeatuer
        .logInUser(jestUser, sequelize)
        .then()
        .catch((error: any) => {
            expect(error).toBeDefined();
            expect(error).toBe("Password dont match");
            done();
        });
}, 6000);
