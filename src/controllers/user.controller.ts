import { Request, Response } from "express";

import userService = require("../services/user.service");
import articleService = require("../services/article.service");

export async function create(req: Request, res: Response) {
    if (!req.body.username || !req.body.email || !req.body.password) {
        res.status(400).end("Missing username, email, or password");
        return;
    }

    userService
        .create(req.body.username, req.body.email, req.body.password)
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((err) => {
            console.error("Error while creating user:", err);
            res.status(500).end(err);
        });
}

export async function getAllUsers(req: Request, res: Response) {
    userService
        .getAllUsers()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.error("Error while getting all users:", err);
            res.status(500).end(err);
        });
}

export async function get(req: Request, res: Response) {
    if (!req.params.id) {
        console.error("Error while getting user: Missing userId");
        res.status(400).end("Missing userId");
    }

    userService
        .get(req.params.id)
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((err) => {
            console.error("Error while getting user:", err);
            res.status(500).end(err);
        });
}

export async function update(req: Request, res: Response) {
    userService
        .update(
            req.params.id,
            req.body.newUsername,
            req.body.newEmail,
            req.body?.newPassword
        )
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((err) => {
            console.error("Error while updating user:", err);
            res.status(500).end(err);
        });
}

export async function getUserArticles(req: Request, res: Response) {
    if (!req.params.id) {
        console.error("Error while getting user articles: Missing userId");
        res.status(400).end("Missing userId");
    }

    articleService
        .getArticlesByUserId(req.params.id)
        .then((articles) => {
            res.status(200).json(articles);
        })
        .catch((err) => {
            console.error("Error while getting user articles:", err);
            res.status(400).end(err);
        });
}
