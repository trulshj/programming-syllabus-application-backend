import { Op } from "@sequelize/core";
import { Article } from "../database/models/Article.model";
import { File } from "../database/models/File.model";
import { Tag } from "../database/models/Tag.model";
import { User } from "../database/models/User.model";
import { FileDto } from "../types/FileDto";
import { TagDto } from "../types/TagDto";

import tagService = require("./tag.service");

const includeArray = [
    {
        model: Tag,
        through: { attributes: [] },
        attributes: ["id", "name", "tagType"],
    },
    { model: File, attributes: ["id", "hash", "name", "altText"] },
    { model: User, attributes: ["id", "username"] },
];

export async function getArticlesByUserId(userId: string) {
    const articles = await Article.findAll({
        where: { authorId: userId },
        include: includeArray,
    });
    return articles;
}

export async function getAll(searchString: string | undefined = undefined) {
    return new Promise<Article[]>(async (res, err) => {
        let articles: Article[];

        if (searchString) {
            articles = await Article.findAll({
                include: includeArray,
                where: {
                    [Op.or]: {
                        title: { [Op.like]: `%${searchString}%` },
                        description: { [Op.like]: `%${searchString}%` },
                    },
                },
            });
        } else {
            articles = await Article.findAll({
                include: includeArray,
            });
        }
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
        await Article.update(
            {
                title: newTitle,
                description: newDescription,
            },
            { where: { id: articleId } }
        );

        if (newTags) {
            await tagService.clearArticleTags(articleId);
            await tagService.addArticleTags(articleId, newTags);
        }

        if (newFiles) {
            await File.destroy({ where: { articleId: articleId } });
            for (let file of newFiles) {
                await File.create({
                    articleId: articleId,
                    name: file.name,
                    hash: file.hash,
                    altText: file.altText,
                });
            }
        }
        const updatedArticle = await Article.findByPk(articleId);

        if (!updatedArticle) {
            err("Could not get article after updating");
            return;
        }

        res(updatedArticle);
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
