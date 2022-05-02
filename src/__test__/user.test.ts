import DoneCallback = jest.DoneCallback;
import { initSequelize } from "../utils/helper";

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

test("create a user", (done) => {
    const user = require("./userDao")(sequelize);
    const newUser = {
        username: "a new user",
        email: "username@email.com",
        password: "a password",
    };

    user.createUser(newUser).then((res: string | undefined) => {
        expect(res).toBeDefined();
        expect(res).toBe("user created");
        done();
    });
}, 6000);

test("testing duplicate username", (done) => {
    const user = require("./userDao")(sequelize);
    const newUser = {
        username: "admin",
        email: "user@email.com",
        password: "a password",
    };

    user.createUser(newUser).then((res: string | undefined) => {
        expect(res).toBeUndefined();
        done();
    });
}, 6000);

test("testing duplicate email", (done) => {
    const user = require("./userDao")(sequelize);
    const newUser = {
        username: "jestUser",
        email: "admin@admin.com",
        password: "a password",
    };

    user.createUser(newUser).then((res: string | undefined) => {
        expect(res).toBeUndefined();
        done();
    });
}, 6000);

afterAll((done) => {
    sequelize.close().then(done());
});
