import DoneCallback = jest.DoneCallback;
import { IArticle } from "../article/IArticle";
import { initSequelize } from "../lib/helper";
import { Article } from "../database/models/Article.model";


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

test("fething article from database", (done) => {
    Article.getArticle(2).then((oneArticle: JSON) => {
        expect(JSON.stringify(oneArticle).length).toBeGreaterThan(10);
        done();
    });
}, 6000);

test("trying to fetch data from hidden article", (done) => {
    Article
        .getArticle(1)
        .then()
        .catch((error: any) => {
            expect(error).toBeDefined();
            done();
        });
}, 6000);

test("trying to fetch unpublished by owned user", (done) => {
    Article
        .getArticle(
            1,
            "6d9010b2b7a1483b256ae7477738dba7c530bd9ba53db1d6691441e74b83608a"
        )
        .then((article: IArticle) => {
            expect(article).toBeDefined();
            expect(article.timeToComplete).toBe(20);
            done();
        });
}, 6000);

test("trying to fetch unpublished by admin", (done) => {
    const article = require("./article")(sequelize);
    article
        .getArticle(
            1,
            "fc8252c8dc55839967c58b9ad755a59b61b67c13227ddae4bd3f78a38bf394f7"
        )
        .then((article: IArticle) => {
            expect(article).toBeDefined();
            expect(article.timeToComplete).toBe(20);
            done();
        });
}, 6000);

afterAll((done) => {
    sequelize.close().then(done());
});
