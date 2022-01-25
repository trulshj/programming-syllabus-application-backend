// https://sequelize.org/v5/manual/
import { Sequelize } from "sequelize";
module.exports = () => {
    return {
        async setup(sequelize: Sequelize): Promise<void> {
            //models
            const article = require("./models/articleModel")(sequelize);
            const user = require("./models/userModel")(sequelize);
            const fileModel = require("./models/fileModel")(sequelize);
            const subject = require("./models/subjectModel")(sequelize);
            const imageModel = require("./models/imageModel")(sequelize);
            const toolModel = require("./models/toolModel")(sequelize);
            const themeModel = require("./models/themeModel")(sequelize);
            const gradeModel = require("./models/gradeLevelModel")(sequelize);

            //associations
            sequelize.model("article").hasMany(fileModel, {
                sourceKey: "article_id",
                foreignKey: "article_id",
            });
            sequelize.model("file").belongsTo(article, {
                foreignKey: "article_id",
            });

            sequelize.model("article").hasMany(imageModel, {
                sourceKey: "article_id",
                foreignKey: "article_id",
            });
            sequelize.model("image").belongsTo(article, {
                foreignKey: "article_id",
            });

            sequelize.model("user").hasMany(article, {
                sourceKey: "user_id",
                foreignKey: "author_id",
            });

            sequelize.model("article").belongsTo(user, {
                foreignKey: "author_id",
            });

            // many to many Association
            sequelize.model("article").belongsToMany(subject, {
                through: "subject_in_article",
            });
            sequelize.model("subject").belongsToMany(article, {
                through: "subject_in_article",
            });

            sequelize.model("article").belongsToMany(toolModel, {
                through: "tool_in_article",
                timestamps: false,
            });
            sequelize.model("tool").belongsToMany(article, {
                through: "tool_in_article",
                timestamps: false,
            });

            sequelize.model("article").belongsToMany(themeModel, {
                through: "theme_in_article",
                timestamps: false,
            });
            sequelize.model("theme").belongsToMany(article, {
                through: "theme_in_article",
                timestamps: false,
            });

            sequelize.model("article").belongsToMany(gradeModel, {
                through: "grade_in_article",
                timestamps: false,
            });
            sequelize.model("grade_level").belongsToMany(article, {
                through: "grade_in_article",
                timestamps: false,
            });

            // mock-data
            await sequelize
                .sync({ force: process.env.DATABASE_FORCE_UPDATE == "true" })
                .then(async () => {
                    if (process.env.SERVER_TEST_DATA == "true") {
                        console.log("adding mock data to database");
                        const dataUser = require("./mock/userMock.json");
                        for (let userNumber in dataUser) {
                            await user
                                .create(dataUser[userNumber])
                                .catch((error: any) => console.error(error));
                        }

                        const articleData = require("./mock/articleMock.json");
                        for (let articleNumber in articleData) {
                            await article
                                .create(articleData[articleNumber])
                                .catch((error: any) => console.error(error));
                        }
                        const subjectData = require("./mock/subjectMock.json");
                        for (let subjectNumber in subjectData) {
                            await subject
                                .create(subjectData[subjectNumber])
                                .catch((error: any) => console.error(error));
                        }

                        const subject_article_Data = require("./mock/subject_in_articlesMock.json");
                        for (let subjectNumber in subject_article_Data) {
                            await sequelize
                                .model("subject_in_article")
                                .create(subject_article_Data[subjectNumber])
                                .catch((error: any) => console.error(error));
                        }

                        const fileData = require("./mock/fileMock.json");
                        for (let fileNumber in fileData) {
                            await fileModel
                                .create(fileData[fileNumber])
                                .catch((error: any) => console.error(error));
                        }

                        const imageData = require("./mock/imageMock.json");
                        for (let imageNumber in imageData) {
                            await imageModel
                                .create(imageData[imageNumber])
                                .catch((error: any) => console.error(error));
                        }

                        const toolData = require("./mock/toolMock.json");
                        for (let toolNumber in toolData) {
                            await toolModel
                                .create(toolData[toolNumber])
                                .catch((error: any) => console.error(error));
                        }

                        const tool_in_article = require("./mock/toolinArticleMock.json");
                        for (let toolNumber in tool_in_article) {
                            await sequelize
                                .model("tool_in_article")
                                .create(tool_in_article[toolNumber])
                                .catch((error: any) => console.error(error));
                        }

                        const gradeData = require("./mock/gradeMock.json");
                        for (let number in gradeData) {
                            await gradeModel
                                .create(gradeData[number])
                                .catch((error: any) => console.error(error));
                        }

                        const gradeInArticleData = require("./mock/gradeInArticle.json");
                        for (let number in gradeInArticleData) {
                            await sequelize
                                .model("grade_in_article")
                                .create(gradeInArticleData[number])
                                .catch((error: any) => console.error(error));
                        }
                        const themeData = require("./mock/themeMock.json");
                        for (let number in themeData) {
                            await themeModel
                                .create(themeData[number])
                                .catch((error: any) => console.error(error));
                        }
                        const themeInArticleData = require("./mock/themeInArticle.json");
                        for (let number in themeInArticleData) {
                            await sequelize
                                .model("theme_in_article")
                                .create(themeInArticleData[number])
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
