import { Request, Response } from "express";

import tagService = require("../services/tag.service");

export async function getAll(req: Request, res: Response) {
    tagService
        .getAll()
        .then((tags) => {
            res.status(200).json(tags);
        })
        .catch((err) => {
            console.error("Error while getting all articles:", err);
            res.status(500).end(err);
        });
}
