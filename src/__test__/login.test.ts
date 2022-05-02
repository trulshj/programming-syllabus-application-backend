import DoneCallback = jest.DoneCallback;
import { initSequelize } from "../utils/helper";
const userFeatuer = require("../user/userFeatures");

jest.setTimeout(50000);

// Sequelize database connection
const sequelize = initSequelize();

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
/*
test("login a user", (done) => {
    const jestUser: UserDto = {
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
    const jestUser: UserDto = {
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
    const jestUser: UserDto = {
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
*/
