import { Application, Request, Response } from "express";
import { Sequelize } from "sequelize";
import { IArticle } from "./IArticle";

/**
 * @swagger
 * definitions:
 *   getArticleResponse:
 *     properties:
 *       article_title:
 *         type: string
 *       article_author:
 *         type: string
 *       article_description:
 *         type: string
 *       publication_date:
 *         type: string
 *       article_change_date:
 *         type: string
 *       time_to_complete:
 *         type: integer
 *       subjects:
 *         type: array
 *         items:
 *          type: string
 *
 *       kode_languages:
 *         type: array
 *         items:
 *          type: string
 *       files:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *            file_name:
 *              type: string
 *            file_type:
 *              type: string
 *
 *
 *
 *   postArticleRequest:
 *     required:
 *     properties:
 *       article_title:
 *         type: string
 *       author_id:
 *         type: string
 *       article_description:
 *         type: string
 *       time_to_complete:
 *         type: integer
 *       subject:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *            subject_id:
 *              type: integer
 *
 *       files:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *            file_name:
 *              type: string
 *
 *
 *       images:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *            file_name:
 *              type: string
 *            alt_text:
 *              type: string
 *
 *
 *
 *   getArticleQueryResponse:
 *     properties:
 *       article_title:
 *         type: string
 *       article_author:
 *         type: string
 *       publications_date:
 *         type: string
 *       article_change_date:
 *         type: string
 *       time_to_complete:
 *         type: integer
 *       subjects:
 *         type: array
 *         items:
 *          type: string
 *
 *       kode_languages:
 *         type: array
 *         items:
 *          type: string
 *       files:
 *         type: array
 *         items:
 *          type: object
 *          properties:
 *            file_name:
 *              type: string
 *            file_type:
 *              type: string
 *
 *
 */

module.exports = (
    app: Application,
    apiURL: string,
    endPoint: string,
    sequelize: Sequelize
) => {
    const article = require("./article")(sequelize);
    const articleList = require("../articleList/articleListDao");
    const url: string = apiURL + endPoint;

    /**
     * @swagger
     * /articlelist:
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
     *          name: query
     *          schema:
     *              type: string
     *          required: false
     *        - in: header
     *          name: userID
     *          schema:
     *              type: string
     *          required: false
     *     responses:
     *       200:
     *        description: returns a list of articles with the most important values.
     *        schema:
     *
     */
    app.get(url, (req: Request, res: Response) => {
        if (req.header("query-type") == "byUser" && req.header("userID")) {
            articleList()
                .getByUser(sequelize, req.header("userID"))
                .then((article: JSON) => {
                    res.status(200).json({
                        article,
                    });
                });
        } else if (req.header("query")) {
            articleList()
                .searchArticleList(sequelize, req.header("query"))
                .then((article: JSON) => {
                    if (article != undefined) {
                        res.status(200).json({
                            article,
                        });
                    } else {
                        res.status(404).json({});
                    }
                });
        } else {
            articleList()
                .getArticleList(sequelize, req.header("userID"))
                .then((article: JSON) => {
                    console.log(article);
                    if (article != undefined) {
                        res.status(200).json({
                            article,
                        });
                    } else {
                        res.status(404).json({});
                    }
                });
        }
    });

    /**
     * @swagger
     *
     * /article:
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

    app.post(url, (req: Request, res: Response) => {
        article
            .createArticle(req)
            .then((article: IArticle | undefined | { error: string }) => {
                if (article != undefined) {
                    res.status(200).json({
                        status: "article created",
                    });
                } else {
                    res.status(400).json({
                        status: "failed creating article",
                    });
                }
            })
            .catch((error: any) => {
                console.log(error);
                res.status(400).json({
                    status: "failed creating article",
                });
            });
    });

    /**
     * @swagger
     * /article:
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

    app.get(url, (req: Request, res: Response) => {
        res.status(501).json({
            "server-status": "articles are not implemented yet",
        });
    });

    /**
     * @swagger
     * /article/{articleID}:
     *   get:
     *     description: fetch info about one specific article by id
     *     tags:
     *      - article
     *     parameters:
     *       - in: path
     *         name: articleID
     *         required: true
     *         type: integer
     *         minimum: 1
     *       - in: header
     *         name: user_id
     *         type: string
     *     responses:
     *       200:
     *        description: response from the server
     *        schema:
     *              $ref: '#/definitions/getArticleResponse'
     *
     */

    app.get(`${url}/:id`, (req: Request, res: Response) => {
        if (req.params.id) {
            article
                .getArticle(req.params.id, req.header("user_id"))
                .then((article: IArticle | undefined) => {
                    res.status(200).json({
                        article,
                    });
                })
                .catch((error: any) => {
                    res.status(404).json({
                        status: error.toString(),
                    });
                });
        } else {
            res.status(404).json({
                status: "article not found",
            });
        }
    });

    /**
     * @swagger
     *
     * /article/{articleID}:
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

    app.put(`${url}/:id`, (req: Request, res: Response) => {
        article
            .updateArticle(req.params.id, req)
            .then((article: IArticle | undefined | { error: string }) => {
                if (article != undefined) {
                    res.status(200).json({
                        status: "article updated",
                    });
                } else {
                    res.status(400).json({
                        status: "failed updating article",
                    });
                }
            })
            .catch((error: any) => {
                console.error("error updating article:", error);
                res.status(400).json({
                    status: error.toString(),
                });
            });
    });

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

    app.delete(`${url}/:id`, (req: Request, res: Response) => {
        res.status(501).json({
            "server-status": "deleting articles are not implemented yet",
        });
    });
};
