import { Request, Response } from "express";
import { UserDto } from "../types/UserDto";

import userService = require("../services/user.service");

export async function login(req: Request, res: Response) {
    userService
        .login(req.body.email, req.body.password)
        .then((user: UserDto) => {
            res.status(200).json(user);
        })
        .catch((error) => {
            console.error(error);
            res.status(401).end(error.toString());
        });
}
