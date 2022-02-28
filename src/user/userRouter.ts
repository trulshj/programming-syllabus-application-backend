/**
 * @swagger
 * definitions:
 *   getUserResponse:
 *     required:
 *     properties:
 *       userid:
 *          type: number
 *       username:
 *         type: string
 *       role:
 *         type: string
 *       email:
 *         type: string
 *
 *   postUser:
 *     required:
 *       - username
 *       - email
 *       - password
 *     properties:
 *       username:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *          type: string
 *       user_id:
 *          type: string
 *
 *   postUserResponse:
 *     required:
 *       - username
 *       - role
 *       - email
 *     properties:
 *       username:
 *          type: string
 *       role:
 *          type: string
 *       email:
 *          type: string
 *       token:
 *           type: string
 *
 *
 *
 */

import { Application, Request, Response } from "express";
import { getUser, updateUser } from "./userDao";

module.exports = (app: Application, apiURL: string, endPoint: string) => {
    const url: string = apiURL + endPoint;
    /**
     * @swagger
     * /user:
     *   get:
     *     description: retrieves the parameter of a user when you logging
     *     tags:
     *      - user
     *
     *     parameters:
     *      - in: header
     *        name: "username"
     *        description: username of the user.
     *      - in: header
     *        name: token
     *        description:
     *          description: authentication token
     *
     *
     *     responses:
     *       200:
     *        description: response user-data
     *        schema:
     *              $ref: '#/definitions/getUserResponse'
     *
     *
     *
     */

    app.get(url, (req: Request, res: Response) => {
        res.status(501).json({
            "status-message": "this functions is not yet implemented",
        });
    });

    /**
     * @swagger
     *
     * /user:
     *      post:
     *       description: Registration of an user
     *       tags:
     *          - user
     *       consumes:
     *          - application/json
     *       parameters:
     *           - in: body
     *             name: "user"
     *             description: some registration data.
     *             schema:
     *               $ref: '#/definitions/postUser'
     *       responses:
     *         200:
     *          description: ok(response not decided yet)
     *
     */

    // create account

    /* TODO:
    app.post(url, (req: Request, res: Response) => {
        if (req.body.username && req.body.email && req.body.password) {
            user.createUser(req.body).then((user: string | undefined) => {
                if (user != undefined) {
                    res.status(200).json({
                        status: user,
                    });
                } else {
                    res.status(403).json({
                        status: "username or email taken",
                    });
                }
            });
        } else {
            res.status(400).json({
                error: "bad request",
            });
        }
    });

    */

    /**
     * @swagger
     *
     * /user:
     *      put:
     *       description: update of an user
     *       tags:
     *          - user
     *       consumes:
     *          - application/json
     *       parameters:
     *           - in: header
     *             name: user_id
     *             description: the unique id for your account
     *           - in: header
     *             name: token
     *             description: authentication token
     *           - in: body
     *             name: " "
     *             description: some registration data.
     *             schema:
     *               $ref: '#/definitions/postUser'
     *       responses:
     *         200:
     *          description: note response not decided yet
     */

    app.put(url, async (req: Request, res: Response) => {
        const result = await updateUser(req.body);
        if (result.success) {
            res.status(200).json({ status: result.message });
        } else {
            res.status(500).json({ staus: result.message });
        }
    });

    app.get(`${url}/:id`, async (req: Request, res: Response) => {
        if (!req.params.id) {
            res.status(400).json({ error: "Bad request, invalid userId" });
        }

        const user = await getUser(req.params.id);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: "Could not find user" });
        }
    });

    app.get(`${url}/:id/articles`, async (req: Request, res: Response) => {
        if (!req.params.id) {
            res.status(400).json({ error: "Bad request, invalid userId" });
        }

        const user = await getUser(req.params.id);
        const userArticles = await user?.getArticles();

        if (userArticles) {
            res.status(200).json(userArticles);
        } else {
            res.status(404).json({
                error: "Could not retrieve articles for user",
            });
        }
    });
};
