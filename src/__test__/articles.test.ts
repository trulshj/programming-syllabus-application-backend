import DoneCallback = jest.DoneCallback;
import articleService = require("../services/article.service");

jest.setTimeout(10_000);

beforeAll((done: DoneCallback) => {
    setTimeout(() => {
        done();
    }, 3_000);
});

test("Get article", async () => {
    articleService.get(1).then((res) => {
        expect(res.id).toBe(1);
    });
});

test("Get all articles", async () => {
    articleService.getAll().then((res) => {
        expect(res.length).toBeGreaterThan(1);
    });
});

test("Create article", async () => {
    const newArticle = {
        title: "Articles 101",
        description: "How to create articles",
        authorId:
            "fc8252c8dc55839967c58b9ad755a59b61b67c13227ddae4bd3f78a38bf394f7",
        tags: [],
        files: [],
    };

    articleService
        .create(
            newArticle.title,
            newArticle.description,
            newArticle.authorId,
            newArticle.tags,
            newArticle.files
        )
        .then((res) => {
            expect(res.title).toBe(newArticle.title);
        });
});

test("Update article", async () => {
    const newArticle = {
        title: "Articles 101",
        description: "How to create articles",
        authorId:
            "fc8252c8dc55839967c58b9ad755a59b61b67c13227ddae4bd3f78a38bf394f7",
        tags: [],
        files: [],
    };

    const article = await articleService.create(
        newArticle.title,
        newArticle.description,
        newArticle.authorId,
        newArticle.tags,
        newArticle.files
    );

    const newTitle = "Articles 201";
    const newDescription = "How to update articles";

    articleService
        .update(
            article.id,
            newTitle,
            newDescription,
            newArticle.tags,
            newArticle.files
        )
        .then((res) => {
            expect(res.title).toBe(newTitle);
        });
});
