import DoneCallback = jest.DoneCallback;
import fileService = require("../services/file.service");

jest.setTimeout(10_000);

beforeAll((done: DoneCallback) => {
    setTimeout(() => {
        done();
    }, 3_000);
});

test("Create and get a new file", async () => {
    const fileHash = "hash.txt";
    const fileName = "textfile.txt";

    const file = await fileService.create(1, fileHash, fileName);

    expect(file.hash).toBe(fileHash);
    expect(file.id).toBeDefined();

    const fileInfo = await fileService.get(file.id.toString());
    expect(fileInfo.name).toBe(fileName);
});
