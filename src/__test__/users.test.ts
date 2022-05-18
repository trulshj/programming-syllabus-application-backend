import DoneCallback = jest.DoneCallback;
import userService = require("../services/user.service");

jest.setTimeout(10_000);

beforeAll((done: DoneCallback) => {
    setTimeout(() => {
        done();
    }, 3_000);
});

test("create a user", async () => {
    const newUser = {
        username: "user100",
        email: "user100@email.com",
        password: "password123",
    };

    userService
        .create(newUser.username, newUser.email, newUser.password)
        .then((res) => expect(res.username).toBe(newUser.username));
});

test("testing duplicate username", async () => {
    const newUser = {
        username: "admin",
        email: "user101@email.com",
        password: "password123",
    };

    userService
        .create(newUser.username, newUser.email, newUser.password)
        .catch((err) => expect(err).toBe("Username already taken"));
});

test("testing duplicate email", async () => {
    const newUser = {
        username: "user102",
        email: "admin@admin.com",
        password: "password123",
    };

    userService
        .create(newUser.username, newUser.email, newUser.password)
        .catch((err) => expect(err).toBe("Email already in use"));
});
