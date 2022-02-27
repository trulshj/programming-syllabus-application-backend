import DoneCallback = jest.DoneCallback;
import { initSequelize } from "../lib/helper";

const fs = require("fs");
const artifactPath: string = "./outdir/artifacts/";
const fileSha: string =
    "ecdc5536f73bdae8816f0ea40726ef5e9b810d914493075903bb90623d97b1d8";
const imageSha: string =
    "ffff5536f73bdae8816f0ea40726ef5e9b810d914493075903bb90623d97b1d8";
jest.setTimeout(50000);

// Sequelize database connection
const sequelize = initSequelize();

const database = require("../database/database");
beforeAll(async (done: DoneCallback) => {
    await sequelize.authenticate().then(async () => {
        await database()
            .setup(sequelize)
            .then(async () => {
                await fs.mkdir(artifactPath, () => {
                    fs.writeFile(artifactPath + fileSha, "a test file", () => {
                        console.log("finished making file");
                        fs.writeFile(
                            artifactPath + imageSha,
                            "a image file",
                            () => {
                                console.log("finished making image file");
                                done();
                            }
                        );
                    });
                });
            });
    });
});

test("fetching artifacts(files) from backend", async (done) => {
    const file = require("./fileDao");
    file(artifactPath)
        .getFile(sequelize.model("File"), sequelize.model("image"), fileSha)
        .then((res: string[]) => {
            expect(res).toBeDefined();
            expect(res[1]).toBe("Fil nr 1.txt");
            done();
        });
}, 6000);

test("fetching artifacts(files) from backend, file is in database but missing physically", async (done) => {
    const file = require("./fileDao");
    await file(artifactPath)
        .getFile(
            sequelize.model("File"),
            sequelize.model("image"),
            "67ee5478eaadb034ba59944eb977797b49ca6aa8d3574587f36ebcbeeb65f70e"
        )
        .then(async (res: string[]) => {
            expect(res).toBeUndefined();
            done();
        });
}, 8000);

test("fetching artifacts(files) from backend, file not in database", async (done) => {
    const file = require("./fileDao");
    file(artifactPath)
        .getFile(
            sequelize.model("File"),
            sequelize.model("image"),
            "10ee5478eaadb034ba59944eb977797b49ca6aa8d3574587f36ebcbeeb65f70e"
        )
        .then((res: string[]) => {
            expect(res).toBeUndefined();
            done();
        });
}, 6000);

test("fetching artifacts(image) from backend", async (done) => {
    const file = require("./fileDao");
    file(artifactPath)
        .getFile(sequelize.model("File"), sequelize.model("image"), imageSha)
        .then((res: string[]) => {
            expect(res).toBeDefined();
            done();
        });
}, 6000);

test("fetching artifacts(images) from backend, file is in database but missing physically", async (done) => {
    const file = require("./fileDao");
    file(artifactPath)
        .getFile(
            sequelize.model("File"),
            sequelize.model("image"),
            "erty5478eaadb034ba59944eb977797b49ca6aa8d3574587f36ebcbeeb65f70e"
        )
        .then((res: string[]) => {
            expect(res).toBeUndefined();
            done();
        });
}, 6000);

afterAll((done) => {
    sequelize.close().then(done());
});
