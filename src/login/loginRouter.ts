import { Application, Request, Response } from "express";
import { IUser } from "../user/IUser";
import { Sequelize } from "sequelize";
const userFeature = require("../user/userFeatures");

/**
 * @swagger
 * definitions:
 *   postLoginResponse:
 *     required:
 *       - token
 *     properties:
 *       token:
 *         type: string
 *   postLoginRequest:
 *     properties:
 *       email:
 *         type: string
 *       password:
 *          type: string
 */

module.exports = (
    app: Application,
    apiURL: string,
    endPoint: string,
    sequelize: Sequelize
) => {
    const url: string = apiURL + endPoint;

    /**
     * @swagger
     *
     * /login:
     *      post:
     *       description: login
     *       tags:
     *          - login
     *       consumes:
     *          - application/json
     *       parameters:
     *           - in: body
     *             name: " "
     *             description: Login a user
     *             schema:
     *              $ref: '#/definitions/postLoginRequest'
     *       responses:
     *         200:
     *          description: returns token
     *          schema:
     *              $ref: '#/definitions/postLoginResponse'
     */

    app.post(url, (req: Request, res: Response) => {
        userFeature
            .logInUser(req.body, sequelize)
            .then((user: IUser) => {
                res.status(200).json({
                    status: "ok",
                    user,
                });
            })
            .catch((erros: any) => {
                console.error(erros);
                res.status(404).json({
                    status: erros.toString(),
                });
            });
    });
};
