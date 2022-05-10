import { Request, Response } from "express";
import { File } from "formidable";
import formidable = require("formidable");

import articleService = require("../services/article.service");
import fileService = require("../services/file.service");
import { FileDto } from "../types/FileDto";

export async function getAll(req: Request, res: Response) {
    const searchString = req.query.search?.toString();

    articleService
        .getAll(searchString)
        .then((articles) => {
            res.status(200).json(articles);
        })
        .catch((err) => {
            console.error("Error while getting all articles:", err);
            res.status(500).end(err);
        });
}

export async function get(req: Request, res: Response) {
    articleService
        .get(parseInt(req.params.id))
        .then((article) => {
            res.status(200).json(article);
        })
        .catch((err) => {
            console.error("Error while getting article:", err);
            res.status(500).end(err);
        });
}

export async function create(req: Request, res: Response) {
    const form = formidable({
        multiples: true,
        uploadDir: "./artifacts",
        keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
        const bodyString = fields?.body as string;
        const body = JSON.parse(bodyString);

        const articleFiles: FileDto[] = [];

        if (files?.file) {
            if (typeof (files?.file as any)?.map === "function") {
                (files?.file as File[])
                    ?.map((x) => {
                        return {
                            id: "",
                            hash: x.path.slice(10),
                            name: x.name ?? "",
                            altText: undefined,
                        };
                    })
                    .forEach((x) => articleFiles.push(x));
            } else {
                const x = files?.file as File;
                articleFiles.push({
                    id: "",
                    hash: x.path.slice(10),
                    name: x.name ?? "",
                    altText: undefined,
                });
            }
        }

        if (files?.thumbnail) {
            const thumbnail = files?.thumbnail as File;
            articleFiles.push({
                id: "",
                hash: thumbnail.path.slice(10),
                name: thumbnail.name ?? "",
                altText: "Thumbnail for article",
            });
        }

        if (!body.authorId) {
            console.error("Missing authorId when creating article");
            res.status(400).end("Missing authorId");
            return;
        }

        articleService
            .create(
                body.title,
                body.description,
                body.authorId,
                body.Tags,
                articleFiles
            )
            .then(async (article) => {
                res.status(200).json(article);
            })
            .catch((err) => {
                console.error("Error while creating article:", err);
                res.status(500).end(err);
            });
    });
}

export async function update(req: Request, res: Response) {
    const form = formidable({
        multiples: true,
        uploadDir: "./artifacts",
        keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
        const bodyString = fields?.body as string;
        const body = JSON.parse(bodyString);

        const articleFiles: FileDto[] = [];

        if (files?.file) {
            if (typeof (files?.file as any)?.map === "function") {
                (files?.file as File[])
                    ?.map((x) => {
                        return {
                            id: "",
                            hash: x.path.slice(10),
                            name: x.name ?? "",
                            altText: undefined,
                        };
                    })
                    .forEach((x) => articleFiles.push(x));
            } else {
                const x = files?.file as File;
                articleFiles.push({
                    id: "",
                    hash: x.path.slice(10),
                    name: x.name ?? "",
                    altText: undefined,
                });
            }
        }

        if (files?.thumbnail) {
            const thumbnail = files?.thumbnail as File;
            articleFiles.push({
                id: "",
                hash: thumbnail.path.slice(10),
                name: thumbnail.name ?? "",
                altText: "Thumbnail for article",
            });
        }

        if (!body.authorId) {
            console.error("Missing authorId when creating article");
            res.status(400).end("Missing authorId");
            return;
        }

        articleService
            .update(
                parseInt(req.params.id),
                body.title,
                body.description,
                body.Tags,
                articleFiles
            )
            .then((article) => {
                res.status(200).json(article);
            })
            .catch((err) => {
                console.error("Error while updating article:", err);
                res.status(500).end(err);
            });
    });
}

export async function remove(req: Request, res: Response) {
    articleService
        .remove(req.params.id)
        .then((articleId) => {
            res.status(200).json(articleId);
        })
        .catch((err) => {
            console.error("Error while deleting article:", err);
            res.status(500).end(err);
        });
}
