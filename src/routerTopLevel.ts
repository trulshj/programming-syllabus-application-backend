import { Application } from "express";
import { Sequelize } from "@sequelize/core";
module.exports = (app: Application, baseURL: string, sequelize: Sequelize) => {
    require("./user/userRouter")(app, baseURL, "/users", sequelize);
    require("./article/articleRouter")(app, baseURL, "/articles", sequelize);
    require("./login/loginRouter")(app, baseURL, "/login", sequelize);
    require("./file/fileRouter")(app, baseURL, "/files", sequelize);
};
