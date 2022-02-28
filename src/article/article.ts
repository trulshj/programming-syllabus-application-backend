import { Sequelize } from "@sequelize/core";
import { sequelize } from "../app";
import { Article } from "../database/models/Article.model";
import { File } from "../database/models/File.model";
import { Grade } from "../database/models/Grade.model";
import { Image } from "../database/models/Image.model";
import { Subject } from "../database/models/Subject.model";
import { Theme } from "../database/models/Theme.model";
import { Tool } from "../database/models/Tool.model";
import { User } from "../database/models/User.model";
import { IArticle } from "./IArticle";

const formidable = require("formidable");
const userFeatures = require("../user/userFeatures");

// verifying that the user is allowed to change the article
/**
 * Checks whether a user is allowed to change an article
 * @param userId - The user that is currently trying to edit an article
 * @param articleId - The ID of the article that is being checked
 * @param sequelize
 * @returns
 */
async function verifyUser(
    userId: string,
    articleId: number,
    sequelize: Sequelize
): Promise<boolean> {
    // undefined means that this is a new article
    if (!articleId) {
        return new Promise<boolean>((res) => res(true));
    }

    const article = await Article.findByPk(articleId, { include: User });

    if (!article) {
        return new Promise<boolean>((res) => res(true));
    }

    article.id;

    return new Promise<boolean>((res) => {
        try {
            sequelize
                .model("Article")
                .findOne({
                    where: {
                        id: articleId,
                    },
                })
                .then(async (oneArticle: any) => {
                    if (oneArticle.authorId == userId) {
                        res(true);
                    } else {
                        res(await userFeatures.isAdmin(userId, sequelize));
                    }
                });
        } catch (error: any) {
            console.error(error);
            res(false);
        }
    });
}

export async function getArticle(articleId: number) {
    return await Article.findByPk(articleId, {
        include: [
            {
                model: File,
                attributes: ["id", "name"],
            },
            {
                model: Image,
                attributes: ["fileId", "altText"],
            },
            {
                model: Subject,
                through: { attributes: [] },
                attributes: ["id", "name"],
            },
            {
                model: Theme,
                through: { attributes: [] },
                attributes: ["id", "name"],
            },
            {
                model: Grade,
                through: { attributes: [] },
                attributes: ["id", "name"],
            },
            {
                model: Tool,
                through: { attributes: [] },
                attributes: ["id", "name"],
            },
        ],
    });
}

export async function createArticle(article: IArticle) {
    let created = await Article.create({
        title: article.title,
        description: article.description,
        authorId: article.authorId,
    });

    for (let file of article.files) {
        File.create({ articleId: created.id, name: file.name, id: file.id });
    }

    for (let image of article.images) {
        Image.create({
            articleId: created.id,
            fileId: image.fileId,
            altText: image.altText,
        });
    }

    for (let subject of article.subjects) {
        sequelize
            .model("SubjectArticle")
            .create({ ArticleId: created.id, SubjectId: subject.id });
    }

    for (let theme of article.themes) {
        sequelize
            .model("ThemeArticle")
            .create({ ArticleId: created.id, ThemeId: theme.id });
    }

    for (let grade of article.grades) {
        sequelize
            .model("GradeArticle")
            .create({ ArticleId: created.id, GradeId: grade.id });
    }

    for (let tool of article.tools) {
        sequelize
            .model("ToolArticle")
            .create({ ArticleId: created.id, ToolId: tool.id });
    }
}

export function oldCreateArticle(req: any) {
    return <Promise<JSON | IArticle>>new Promise((res: any, error: any) => {
        try {
            let article: IArticle;
            // max filesize 1G
            const form = formidable({
                multiples: true,
                maxFileSize: 1000000000,
                uploadDir: "./artifacts",
            });

            form.parse(req, async (err: any, fields: any, files: any) => {
                if (err) {
                    console.error(err);
                    return;
                }
                article = JSON.parse(fields.body);
                //article data from json

                await sequelize
                    .model("Article")
                    .create({
                        title: article.title,
                        description: article.description,
                        timeToComplete: article.timeToComplete,
                        authorId: article.authorId,
                    })
                    .then((createdArticle: any) => {
                        if (createdArticle.id) {
                            // file data from forms
                            if (article.files != undefined) {
                                article.files.map(async (oneFile: any) => {
                                    let fomrsFile: any = "";
                                    if (Array.isArray(files.file)) {
                                        const tempFile: any = files.file.find(
                                            (input: { name: string }) => {
                                                return (
                                                    input.name ===
                                                    oneFile.file_name
                                                );
                                            }
                                        );
                                        fomrsFile = tempFile;
                                    } else {
                                        fomrsFile = files.file;
                                    }
                                    await sequelize.model("File").create({
                                        ArticleId: createdArticle.id,
                                        file_name: oneFile.file_name,
                                        fileId: fomrsFile.path.split("/")[1],
                                    });
                                });
                            }

                            if (article.images != undefined) {
                                // image data from forms
                                article.images.map(async (oneImage) => {
                                    let fomrsFile: any = "";
                                    if (Array.isArray(files.file)) {
                                        const tempFile: any = files.file.find(
                                            (input: { name: string }) => {
                                                return (
                                                    input.name ===
                                                    oneImage.fileId
                                                );
                                            }
                                        );
                                        fomrsFile = tempFile;
                                    } else {
                                        fomrsFile = files.file;
                                    }
                                    await sequelize.model("Image").create({
                                        ArticleId: createdArticle.id,
                                        altText: oneImage.altText,
                                        fileId: fomrsFile.path.split("/")[1],
                                    });
                                });
                            }

                            if (article.grades != undefined) {
                                article.grades.map(async (oneGrade) => {
                                    await sequelize
                                        .model("GradeArticle")
                                        .create({
                                            articleArticleId: createdArticle.id,
                                            gradeLevelId: oneGrade.id,
                                        });
                                });
                            }

                            if (article.tools != undefined) {
                                article.tools.map(async (oneTool) => {
                                    await sequelize
                                        .model("ToolArticle")
                                        .create({
                                            ArticleId: createdArticle.id,
                                            tool_id: oneTool.id,
                                        });
                                });
                            }
                        }
                        res(createdArticle);
                    })
                    .catch((er: any) => {
                        console.error(er);
                        error("cant create article");
                    });
            });
        } catch (err: any) {
            console.log("error: ", err ? err : " error not spesified");
            res(undefined);
        }
    });
}

/*
        updateArticle: (articleId: number, req: IArticle) => {
            return <Promise<undefined | JSON>>(
                new Promise((res: any, error: any) => {
                    try {
                        let article: IArticle;
                        // max filesize 1G
                        const form = formidable({
                            multiples: true,
                            maxFileSize: 1000000000,
                            uploadDir: "./artifacts",
                        });

                        form.parse(
                            req,
                            async (err: any, fields: any, files: any) => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                article = JSON.parse(fields.body);
                                if (
                                    !(await verifyUser(
                                        article.authorId,
                                        articleId,
                                        sequelize
                                    ))
                                ) {
                                    error(
                                        "User is not allowed to update article"
                                    );
                                    return;
                                }
                                await sequelize
                                    .model("Article")
                                    .update(
                                        {
                                            title: article.title,
                                            description: article.description,
                                            timeToComplete:
                                                article.timeToComplete,
                                        },
                                        {
                                            silent: await userFeatures.isAdmin(
                                                article.authorId,
                                                sequelize
                                            ),
                                            where: {
                                                id: articleId,
                                            },
                                        }
                                    )
                                    .then(async (sequlizeResponse: any[]) => {
                                        if (article.id != undefined) {
                                            if (article.files != undefined) {
                                                article.files.map(
                                                    async (oneFile: any) => {
                                                        let fomrsFile: any = "";
                                                        if (
                                                            Array.isArray(
                                                                files.file
                                                            )
                                                        ) {
                                                            const tempFile: any =
                                                                files.file.find(
                                                                    (input: {
                                                                        name: string;
                                                                    }) => {
                                                                        return (
                                                                            input.name ===
                                                                            oneFile.file_name
                                                                        );
                                                                    }
                                                                );
                                                            fomrsFile =
                                                                tempFile;
                                                        } else {
                                                            fomrsFile =
                                                                files.file;
                                                        }
                                                        await sequelize
                                                            .model("File")
                                                            .upsert({
                                                                id: article.id,
                                                                file_name:
                                                                    oneFile.file_name,
                                                                fileId: fomrsFile.path.split(
                                                                    "/"
                                                                )[1],
                                                            });
                                                    }
                                                );
                                            }

                                            if (article.images != undefined) {
                                                article.images.map(
                                                    async (oneImage) => {
                                                        let fomrsFile: any = "";
                                                        if (
                                                            Array.isArray(
                                                                files.file
                                                            )
                                                        ) {
                                                            fomrsFile =
                                                                files.file.find(
                                                                    (input: {
                                                                        name: string;
                                                                    }) => {
                                                                        return (
                                                                            input.name ===
                                                                            oneImage.file_name
                                                                        );
                                                                    }
                                                                );
                                                        } else {
                                                            fomrsFile =
                                                                files.file;
                                                        }
                                                        await sequelize
                                                            .model("image")
                                                            .upsert({
                                                                id: article.id,
                                                                altText:
                                                                    oneImage.altText,
                                                                fileId: fomrsFile.path.split(
                                                                    "/"
                                                                )[1],
                                                            });
                                                    }
                                                );
                                            }

                                            if (article.grades != undefined) {
                                                article.grades.map(
                                                    async (oneGrade) => {
                                                        await sequelize
                                                            .model(
                                                                "GradeArticle"
                                                            )
                                                            .upsert({
                                                                articleArticleId:
                                                                    article.id,
                                                                gradeLevelId:
                                                                    oneGrade.id,
                                                            });
                                                    }
                                                );
                                            }

                                            if (article.tools != undefined) {
                                                article.tools.map(
                                                    async (oneTool) => {
                                                        await sequelize
                                                            .model(
                                                                "ToolArticle"
                                                            )
                                                            .upsert({
                                                                ArticleId:
                                                                    article.id,
                                                                tool_id:
                                                                    oneTool.id,
                                                            });
                                                    }
                                                );
                                            }
                                        }
                                        res(sequlizeResponse);
                                    })
                                    .catch((err: any) => {
                                        console.error(err);
                                        error("Could not update article");
                                    });
                            }
                        );
                    } catch (err: any) {
                        console.log(
                            "error: ",
                            err ? err : " error not spesified"
                        );
                        res(undefined);
                    }
                })
            );
        },
    };
};
*/

export async function getUserArticles(userId: string) {
    const user = await User.findByPk(userId);
    return await user?.getArticles({ include: Image, limit: 1 });
}

export async function getArticles() {
    return await Article.findAll({
        include: [
            {
                model: Image,
                attributes: ["fileId", "altText"],
                limit: 1,
            },
            {
                model: Subject,
                through: { attributes: [] },
                attributes: ["id", "name"],
            },
            {
                model: Theme,
                through: { attributes: [] },
                attributes: ["id", "name"],
            },
            {
                model: Grade,
                through: { attributes: [] },
                attributes: ["id", "name"],
            },
            {
                model: Tool,
                through: { attributes: [] },
                attributes: ["id", "name"],
            },
        ],
    });
}
