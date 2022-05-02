import { Article } from "../database/models/Article.model";
import { File } from "../database/models/File.model";
import { Tag } from "../database/models/Tag.model";
import { User } from "../database/models/User.model";
import { FileDto } from "../types/FileDto";
import { TagDto } from "../types/TagDto";

import tagService = require("./tags.service");

const includeArray = [
    {
        model: Tag,
        through: { attributes: [] },
        attributes: ["id", "name", "tagType"],
    },
    { model: File, attributes: ["id", "hash", "name"] },
    { model: User, attributes: ["id", "username"] },
];

export async function getArticlesByUserId(userId: string) {
    const articles = await Article.findAll({
        where: { authorId: userId },
        include: includeArray,
    });
    return articles;
}

export async function getAll() {
    return new Promise<Article[]>(async (res, err) => {
        const articles = await Article.findAll({
            include: includeArray,
        });

        res(articles);
    });
}
export async function get(articleId: number) {
    return new Promise<Article>(async (res, err) => {
        const article = await Article.findByPk(articleId, {
            include: includeArray,
        });

        if (!article) {
            err("Could not find article");
            return;
        }

        res(article);
    });
}

export async function create(
    title: string,
    description: string,
    authorId: string,
    tags: TagDto[],
    files: FileDto[]
) {
    return new Promise<Article>(async (res, error) => {
        const article = await Article.create({
            title: title,
            description: description,
            authorId: authorId,
        });

        if (!article) {
            error("Could not create article");
        }

        await tagService.addArticleTags(article.id, tags);

        for (let file of files) {
            await File.create({
                articleId: article.id,
                name: file.name,
                hash: file.hash,
                altText: file.altText,
            });
        }

        get(article.id)
            .then((art) => {
                res(art);
            })
            .catch((err) => {
                error(err);
            });
    });
}

export async function update(
    articleId: number,
    newTitle: string,
    newDescription: string,
    newTags: TagDto[],
    newFiles: FileDto[]
) {
    return new Promise<Article>(async (res, err) => {
        const article = await Article.findByPk(articleId);

        if (!article) {
            err("Could not find article");
            return;
        }

        if (newTitle) {
            article.setDataValue("title", newTitle);
        }

        if (newDescription) {
            article.setDataValue("title", newTitle);
        }

        if (newTags) {
            await tagService.clearArticleTags(articleId);
            await tagService.addArticleTags(articleId, newTags);
        }

        if (newFiles) {
            await File.destroy({ where: { articleId: article.id } });
            for (let file of newFiles) {
                await File.create({
                    articleId: article.id,
                    name: file.name,
                    hash: file.hash,
                    altText: file.altText,
                });
            }
        }
    });
}

export async function remove(articleId: string) {
    return new Promise<string>(async (res, err) => {
        const affectedRows = await Article.destroy({
            where: { id: articleId },
        });

        if (affectedRows < 1) {
            err("Could not delete row");
            return;
        }

        res(articleId);
    });
}

export async function search(query: any) {
    return new Promise<Article[]>(async (res, err) => {
        const articles = await getAll();

        res(
            articles.filter(
                (x) =>
                    x.title.includes(query.title) ||
                    x.description.includes(query.description)
            )
        );
    });
}
