import { Request, Response } from "express";
import formidable = require("formidable");

import articleService = require("../services/article.service");

export async function getAll(req: Request, res: Response) {
    articleService
        .getAll()
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
    articleService
        .create(
            req.body.title,
            req.body.description,
            req.body.authorId,
            req.body.tags,
            req.body.files
        )
        .then(async (article) => {
            res.status(200).json(article);
        })
        .catch((err) => {
            console.error("Error while creating article:", err);
            res.status(500).end(err);
        });
}

export async function update(req: Request, res: Response) {
    articleService
        .update(
            parseInt(req.params.id),
            req.body.title,
            req.body.description,
            req.body.tags,
            req.body.files
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

export async function search(req: Request, res: Response) {
    articleService
        .search(req.query)
        .then((articles) => {
            res.status(200).json(articles);
        })
        .catch((err) => {
            console.error("Error while searching for articles:", err);
            res.status(500).end(err);
        });
}
