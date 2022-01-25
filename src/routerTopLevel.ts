import { Application } from "express";
import { Sequelize } from "sequelize";
module.exports = (app: Application, baseURL: string, sequelize: Sequelize) => {
    require("./user/userRouter")(app, baseURL, "/user", sequelize);
    require("./article/articleRouter")(app, baseURL, "/article", sequelize);
    require("./articleList/articleListRouter")(
        app,
        baseURL,
        "/articlelist",
        sequelize
    );
    require("./login/loginRouter")(app, baseURL, "/login", sequelize);
    require("./file/fileRouter")(app, baseURL, "/file", sequelize);
};
