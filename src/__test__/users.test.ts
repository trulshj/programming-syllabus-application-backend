import DoneCallback = jest.DoneCallback;
import { initSequelize } from "../utils/helper";
import { User } from "../database/models/User.model";
import { setupDatabase } from "../database/database";

jest.setTimeout(50000);

// Sequelize database connection
const sequelize = initSequelize();

beforeAll((done: DoneCallback) => {
    setTimeout(() => {
        done();
    }, 10000);
});

test("create a user", async () => {
    const newUser = {
        id: "100",
        username: "a new user",
        email: "username@email.com",
        password: "a password",
        roleId: 0,
        verified: true,
    };

    const user = await User.create(newUser);
    expect(user).toBeDefined();
    expect(user.username).toBe("a new user");
});

test("testing duplicate username", async () => {
    const newUser = {
        id: "101",
        username: "admin",
        email: "user@email.com",
        password: "a password",
        roleId: 0,
        verified: true,
    };

    const user = await User.create(newUser);
});

test("testing duplicate email", async () => {
    const newUser = {
        id: "102",
        username: "admin",
        email: "user@email.com",
        password: "a password",
        roleId: 0,
        verified: true,
    };

    const user = await User.create(newUser);
});
