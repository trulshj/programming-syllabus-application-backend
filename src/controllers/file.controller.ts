import { Request, Response } from "express";

import fileService = require("../services/file.service");

export async function get(req: Request, res: Response) {
    fileService
        .get(req.params.id)
        .then((fileInfo) => {
            res.status(200).download(fileInfo.path, fileInfo.name);
        })
        .catch((err) => {
            console.error("Error while getting file", err);
            res.status(404).end(err);
        });
}

export async function create(req: Request, res: Response) {
    /* TODO: Upload files
    fileService
        .create()
        .then((fileInfo) => {
            res.status(200).download(fileInfo.path, fileInfo.name);
        })
        .catch((err) => {
            console.error("Error while creating file", err);
            res.status(404).end(err);
        });
        */
}

export async function remove(req: Request, res: Response) {
    fileService
        .remove(parseInt(req.params.id))
        .then((fileId) => {
            res.status(200).json(fileId);
        })
        .catch((err) => {
            console.error("Error while deleting file", err);
            res.status(404).end(err);
        });
}
