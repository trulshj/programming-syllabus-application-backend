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
    const bodyString = req.fields?.body as string;
    const body = JSON.parse(bodyString);

    const files: FileDto[] = [];

    if (req.files?.file) {
        if (typeof (req.files?.file as any)?.map === "function") {
            (req.files?.file as File[])
                ?.map((x) => {
                    return {
                        id: "",
                        hash: x.path.slice(10),
                        name: x.name ?? "",
                        altText: undefined,
                    };
                })
                .forEach((x) => files.push(x));
        } else {
            const x = req.files?.file as File;
            files.push({
                id: "",
                hash: x.path.slice(10),
                name: x.name ?? "",
                altText: undefined,
            });
        }
    }

    if (req.files?.thumbnail) {
        const thumbnail = req.files?.thumbnail as File;
        files.push({
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
        .create(body.title, body.description, body.authorId, body.Tags, files)
        .then(async (article) => {
            res.status(200).json(article);
        })
        .catch((err) => {
            console.error("Error while creating article:", err);
            res.status(500).end(err);
        });
}

export async function update(req: Request, res: Response) {
    const bodyString = req.fields?.body as string;
    const body = JSON.parse(bodyString);

    const files: FileDto[] = [];

    if (req.files?.file) {
        if (typeof (req.files?.file as any)?.map === "function") {
            (req.files?.file as File[])
                ?.map((x) => {
                    return {
                        id: "",
                        hash: x.path.slice(10),
                        name: x.name ?? "",
                        altText: undefined,
                    };
                })
                .forEach((x) => files.push(x));
        } else {
            const x = req.files?.file as File;
            files.push({
                id: "",
                hash: x.path.slice(10),
                name: x.name ?? "",
                altText: undefined,
            });
        }
    }

    if (req.files?.thumbnail) {
        const thumbnail = req.files?.thumbnail as File;
        files.push({
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
            files
        )
        .then((article) => {
            res.status(200).json(article);
        })
        .catch((err) => {
            console.error("Error while updating article:", err);
            res.status(500).end(err);
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
