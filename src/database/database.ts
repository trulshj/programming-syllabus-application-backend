// https://sequelize.org/v7/manual/
import { Sequelize } from "@sequelize/core";
import { Article } from "./models/Article.model";
import { File } from "./models/File.model";
import { User } from "./models/User.model";
import { Tag } from "./models/Tag.model";

module.exports = () => {
    return {
        async setup(sequelize: Sequelize): Promise<void> {
            //models

            // Article 1:m
            File.belongsTo(Article, { foreignKey: "articleId" });
            Article.hasMany(File, { foreignKey: "articleId" });

            // User 1:m
            Article.belongsTo(User, { foreignKey: "authorId" });
            User.hasMany(Article, { foreignKey: "authorId" });

            // Article Tag n:m
            Article.belongsToMany(Tag, {
                through: "TagArticle",
                timestamps: false,
            });
            Tag.belongsToMany(Article, {
                through: "TagArticle",
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

                        console.info("Adding Tag data");
                        const tagData: {
                            tags: { name: string; tagType: number }[];
                        } = require("./mock/tagMock.json");
                        for (let tag of tagData.tags) {
                            await Tag.create({
                                name: tag.name,
                                tagType: tag.tagType,
                            }).catch((error: any) => console.error(error));
                        }

                        console.info("Adding TagArticle data");
                        const tagArticleData = require("./mock/tagArticleMock.json");
                        for (let tagArticle of tagArticleData.tagArticles) {
                            await sequelize
                                .model("TagArticle")
                                .create(tagArticle)
                                .catch((error: any) => console.error(error));
                        }

                        console.info("Adding File data");
                        const fileData = require("./mock/fileMock.json");
                        for (let fileNumber in fileData) {
                            await File.create(fileData[fileNumber]).catch(
                                (error: any) => console.error(error)
                            );
                        }
                    }
                })
                .then(() => {
                    return;
                });
        },
    };
};
