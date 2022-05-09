import articleController = require("../controllers/article.controller");

import express = require("express");
import formidable = require("formidable");
export const router = express.Router();

/**
 * @swagger
 * /articles:
 *   get:
 *     description: query endpoint for articles
 *     tags:
 *      - article
 *     parameters:
 *        - in: header
 *          name: query-type
 *          schema:
 *              type: string
 *          required: false
 *        - in: header
 *          name: query-settings
 *          schema:
 *              type: string
 *          required: false
 *     responses:
 *       200:
 *        description: returns a list of articles with the most important values. NOTE the response is not finalised yet and might change
 *        schema:
 *              $ref: '#/definitions/getArticleResponse'
 *
 */

router.get("/", articleController.getAll);

/**
 * @swagger
 *
 * /articles:
 *      post:
 *       description: create article
 *       tags:
 *          - article
 *       consumes:
 *          - application/json
 *          - multipart/form-data
 *       parameters:
 *           - in: body
 *             name: " "
 *             description: upload a new article
 *             schema:
 *              $ref: '#/definitions/postArticleRequest'
 *           - in: formData
 *             name: front page image
 *             type: file
 *             description: Upload an image that is going to be display as preview in main page and I search
 *           - in: formData
 *             name: Task file
 *             type: file
 *             description: Upload the assignment document
 *           - in: formData
 *             name: code-files
 *             type: file
 *             description: Upload code files
 *           - in: formData
 *             name: Solution
 *             type: file
 *             description: If you have an solution upload that here
 *       responses:
 *         200:
 *          description: response from the server
 *
 */

router.post("/", articleController.create);

/**
 * @swagger
 * /articles/{articleID}:
 *   get:
 *     description: fetch info about a specific article by id
 *     tags:
 *      - article
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         type: integer
 *         minimum: 1
 *       - in: header
 *         name: userId
 *         type: string
 *     responses:
 *       200:
 *        description: response from the server
 *        schema:
 *              $ref: '#/definitions/getArticleResponse'
 *
 */

router.get("/:id", articleController.get);

/**
 * @swagger
 *
 * /articles/{articleID}:
 *      put:
 *       description: update article
 *       tags:
 *          - article
 *       consumes:
 *          - application/json
 *          - multipart/form-data
 *       parameters:
 *           - in: path
 *             name: articleID
 *             required: true
 *             type: integer
 *             minimum: 1
 *           - in: body
 *             name: ""
 *             description:
 *             schema:
 *              $ref: '#/definitions/postArticleRequest'
 *           - in: formData
 *             name: front page image
 *             type: file
 *             description: Upload an image that is going to be display as preview in main page and I search
 *           - in: formData
 *             name: Task file
 *             type: file
 *             description: Upload the assignment document
 *           - in: formData
 *             name: code-files
 *             type: file
 *             description: Upload code files
 *           - in: formData
 *             name: Solution
 *             type: file
 *             description: If you have an solution upload that here
 *       responses:
 *         200:
 *          description: response from the server
 *
 */

router.put("/:id", articleController.update);

/**
 * @swagger
 *
 * /article/{articleID}:
 *      delete:
 *       description: delete article
 *       tags:
 *          - article
 *       consumes:
 *          - multipart/form-data
 *       parameters:
 *           - in: path
 *             name: userID
 *             required: true
 *             type: integer
 *             minimum: 1
 *             description: only owner or admin can delete and article
 *       responses:
 *         200:
 *          description: response from the server
 *
 */

router.delete("/:id", articleController.remove);
