import express = require("express");
export const router = express.Router();

import fileController = require("../controllers/file.controller");

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

router.get("/:id", fileController.get);

router.post("/", fileController.create);

router.delete("/:id", fileController.remove);
