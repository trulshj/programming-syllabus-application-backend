// https://sequelize.org/v5/manual/
import { Sequelize } from "sequelize";
module.exports = () => {
    return {
        async setup(sequelize: Sequelize): Promise<void> {
            //models
            const Article = require("./models/Article.model")(sequelize);
            const User = require("./models/User.model")(sequelize);
            const File = require("./models/File.model")(sequelize);
            const Subject = require("./models/Subject.model")(sequelize);
            const Image = require("./models/Image.model")(sequelize);
            const Tool = require("./models/Tool.model")(sequelize);
            const Theme = require("./models/Theme.model")(sequelize);
            const Grade = require("./models/Grade.model")(sequelize);

            // Article 1:m
            sequelize.model("Article").hasMany(File);
            sequelize.model("Article").hasMany(Image);

            // User 1:m
            sequelize.model("User").hasMany(Article);

            // Article Subject n:m
            sequelize.model("Article").belongsToMany(Subject, {
                through: "SubjectArticle",
                timestamps: false,
            });
            sequelize.model("Subject").belongsToMany(Article, {
                through: "SubjectArticle",
                timestamps: false,
            });

            // Article Tool n:m
            sequelize.model("Article").belongsToMany(Tool, {
                through: "ToolArticle",
                timestamps: false,
            });
            sequelize.model("Tool").belongsToMany(Article, {
                through: "ToolArticle",
                timestamps: false,
            });

            // Article Theme n:m
            sequelize.model("Article").belongsToMany(Theme, {
                through: "ThemeArticle",
                timestamps: false,
            });
            sequelize.model("Theme").belongsToMany(Article, {
                through: "ThemeArticle",
                timestamps: false,
            });

            // Article Grade n:m
            sequelize.model("Article").belongsToMany(Grade, {
                through: "GradeArticle",
                timestamps: false,
            });
            sequelize.model("Grade").belongsToMany(Article, {
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
