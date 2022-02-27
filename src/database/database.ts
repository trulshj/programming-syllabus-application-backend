// https://sequelize.org/v5/manual/
import { Sequelize } from "sequelize";
import { Article } from "./models/Article.model";
import { File } from "./models/File.model";
import { Grade } from "./models/Grade.model";
import { Image } from "./models/Image.model";
import { Subject } from "./models/Subject.model";
import { Theme } from "./models/Theme.model";
import { Tool } from "./models/Tool.model";
import { User } from "./models/User.model";

module.exports = () => {
    return {
        async setup(sequelize: Sequelize): Promise<void> {
            //models

            // Article 1:m
            File.belongsTo(Article);
            Article.hasMany(File);

            Image.belongsTo(Article);
            Article.hasMany(Image);

            // User 1:m
            Article.belongsTo(User, { foreignKey: "authorId" });
            User.hasMany(Article, { foreignKey: "authorId" });

            // Article Subject n:m
            Article.belongsToMany(Subject, {
                through: "SubjectArticle",
                timestamps: false,
            });
            Subject.belongsToMany(Article, {
                through: "SubjectArticle",
                timestamps: false,
            });

            // Article Tool n:m
            Article.belongsToMany(Tool, {
                through: "ToolArticle",
                timestamps: false,
            });
            Tool.belongsToMany(Article, {
                through: "ToolArticle",
                timestamps: false,
            });

            // Article Theme n:m
            Article.belongsToMany(Theme, {
                through: "ThemeArticle",
                timestamps: false,
            });
            Theme.belongsToMany(Article, {
                through: "ThemeArticle",
                timestamps: false,
            });

            // Article Grade n:m
            Article.belongsToMany(Grade, {
                through: "GradeArticle",
                timestamps: false,
            });
            Grade.belongsToMany(Article, {
                through: "GradeArticle",
                timestamps: false,
            });

            // mock-data
            await sequelize
                .sync({ force: process.env.DATABASE_FORCE_UPDATE == "true" })
                .then(async () => {
                    if (process.env.SERVER_TEST_DATA == "true") {
                        console.info("Adding mock data to the database");
                        const dataUser = require("./mock/userMock.json");
                        for (let userNumber in dataUser) {
                            await User.create(dataUser[userNumber]).catch(
                                (error: any) => console.error(error)
                            );
                        }

                        console.info("Adding Article data");
                        const articleData = require("./mock/articleMock.json");
                        for (let articleNumber in articleData) {
                            await Article.create(
                                articleData[articleNumber]
                            ).catch((error: any) => console.error(error));
                        }

                        console.info("Adding Subject data");
                        const subjectData = require("./mock/subjectMock.json");
                        for (let subjectNumber in subjectData) {
                            await Subject.create(
                                subjectData[subjectNumber]
                            ).catch((error: any) => console.error(error));
                        }

                        console.info("Adding SubjectArticle data");
                        const subjectArticleData = require("./mock/subjectArticleMock.json");
                        for (let subjectNumber in subjectArticleData) {
                            await sequelize
                                .model("SubjectArticle")
                                .create(subjectArticleData[subjectNumber])
                                .catch((error: any) => console.error(error));
                        }

                        console.info("Adding File data");
                        const fileData = require("./mock/fileMock.json");
                        for (let fileNumber in fileData) {
                            await File.create(fileData[fileNumber]).catch(
                                (error: any) => console.error(error)
                            );
                        }

                        console.info("Adding Image data");
                        const imageData = require("./mock/imageMock.json");
                        for (let imageNumber in imageData) {
                            await Image.create(imageData[imageNumber]).catch(
                                (error: any) => console.error(error)
                            );
                        }

                        console.info("Adding Tool data");
                        const toolData = require("./mock/toolMock.json");
                        for (let toolNumber in toolData) {
                            await Tool.create(toolData[toolNumber]).catch(
                                (error: any) => console.error(error)
                            );
                        }

                        console.info("Adding ToolArticle data");
                        const toolArticleData = require("./mock/toolArticleMock.json");
                        for (let toolNumber in toolArticleData) {
                            await sequelize
                                .model("ToolArticle")
                                .create(toolArticleData[toolNumber])
                                .catch((error: any) => console.error(error));
                        }

                        console.info("Adding Grade data");
                        const gradeData = require("./mock/gradeMock.json");
                        for (let number in gradeData) {
                            await Grade.create(gradeData[number]).catch(
                                (error: any) => console.error(error)
                            );
                        }

                        console.info("Adding GradeArticle data");
                        const gradeArticleData = require("./mock/gradeArticleMock.json");
                        for (let number in gradeArticleData) {
                            await sequelize
                                .model("GradeArticle")
                                .create(gradeArticleData[number])
                                .catch((error: any) => console.error(error));
                        }
                        console.info("Adding Theme data");
                        const themeData = require("./mock/themeMock.json");
                        for (let number in themeData) {
                            await Theme.create(themeData[number]).catch(
                                (error: any) => console.error(error)
                            );
                        }
                        console.info("Adding ThemeArticle");
                        const themeArticleData = require("./mock/themeArticleMock.json");
                        for (let number in themeArticleData) {
                            await sequelize
                                .model("ThemeArticle")
                                .create(themeArticleData[number])
                                .catch((error: any) => console.error(error));
                        }
                    }
                })
                .then(() => {
                    return;
                });
        },
    };
};
