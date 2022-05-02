import express = require("express");
export const router = express.Router();

import loginController = require("../controllers/login.controller");

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

router.post("/", loginController.login);
