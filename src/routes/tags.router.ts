import express = require("express");
export const router = express.Router();

import tagController = require("../controllers/tag.controller");

router.get("/", tagController.getAll);
