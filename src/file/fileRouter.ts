import { Application, Request, Response } from "express";
import { Sequelize } from "@sequelize/core";
const file = require("./fileDao");
const artifactpath = "./artifacts/";
/**
 * @swagger
 * /file/{fileID}:
 *   get:
 *     description: fetch file from backend
 *     tags:
 *      - file
 *     parameters:
 *       - in: path
 *         name: fileID
 *         required: true
 *         type: string
 *         minimum: 1
 *     responses:
 *       200:
 *        description: response from the server
 *        schema:
 *              type: file
 *
 */

module.exports = (
    app: Application,
    apiURL: string,
    endPoint: string,
    sequelize: Sequelize
) => {
    const url: string = apiURL + endPoint;
    app.get(url + "/:id", (req: Request, res: Response) => {
        //todo find way to validate that id is sha
        const fileSha = req.params.id;
        file(artifactpath)
            .getFile(sequelize.model("File"), sequelize.model("image"), fileSha)
            .then((fileInfo: string[]) => {
                if (fileInfo != undefined) {
                    res.status(200).download(
                        fileInfo[0],
                        fileInfo[1] ? fileInfo[1] : fileInfo[0]
                    );
                } else {
                    res.status(404).json({});
                }
            });
    });
};
