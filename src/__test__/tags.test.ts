import DoneCallback = jest.DoneCallback;
import tagService = require("../services/tag.service");

jest.setTimeout(10_000);

beforeAll((done: DoneCallback) => {
    setTimeout(() => {
        done();
    }, 3_000);
});

test("Create a new tag", async () => {
    tagService
        .create("grade", "123. Klasse")
        .then((res) => expect(res.name).toBe("123. Klasse"));
});

test("Get all tags", async () => {
    tagService.getAll().then((res) => expect(res.length).toBeGreaterThan(1));
});
