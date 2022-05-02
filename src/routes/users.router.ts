import express = require("express");

import userController = require("../controllers/user.controller");

export const router = express.Router();

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

router.get("/", userController.getAllUsers);

router.get("/:id", userController.get);

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

router.post("/", userController.create);

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

router.put("/", userController.update);

router.get("/:id/articles", userController.getUserArticles);
