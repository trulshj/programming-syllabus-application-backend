import DoneCallback = jest.DoneCallback;
import userService = require("../services/user.service");

jest.setTimeout(10_000);

beforeAll((done: DoneCallback) => {
    setTimeout(() => {
        done();
    }, 3_000);
});

test("Login to a user", async () => {
    const newUser = {
        username: "user200",
        email: "user100@email.com",
        password: "password123",
    };

    await userService.create(newUser.username, newUser.email, newUser.password);

    userService
        .login(newUser.email, newUser.password)
        .then((res) => expect(res.username).toBe(newUser.username));
});

test("Login with wrong password", async () => {
    const newUser = {
        username: "user201",
        email: "user201@email.com",
        password: "password123",
    };

    await userService.create(newUser.username, newUser.email, newUser.password);

    userService
        .login(newUser.email, "wrong")
        .catch((err) => expect(err).toBe("Incorrect password or email"));
});

test("Login with wrong email", async () => {
    const newUser = {
        username: "user202",
        email: "user202@email.com",
        password: "password123",
    };

    await userService.create(newUser.username, newUser.email, newUser.password);

    userService
        .login("wrong", newUser.password)
        .catch((err) => expect(err).toBe("Incorrect password or email"));
});
