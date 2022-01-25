import { Application, Request, Response } from "express";
import { Sequelize } from "sequelize";
/**
 * @swagger
 * definitions:
 *   getArticleListResponse:
 *
 */
module.exports = (
    app: Application,
    apiURL: string,
    endPoint: string,
    sequelize: Sequelize
) => {
    const article = require("./articleListDao");
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
            article()
                .getByUser(sequelize, req.header("userID"))
                .then((article: JSON) => {
                    res.status(200).json({
                        article,
                    });
                });
        } else if (req.header("query")) {
            article()
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
            article()
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
};
