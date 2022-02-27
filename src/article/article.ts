import { Sequelize } from "sequelize";
import { IArticle } from "./IArticle";

const formidable = require("formidable");
const userFeatures = require("../user/userFeatures");

// verifying that the user is allowed to change the article
function verifyUser(
    userId: string,
    articleId: number,
    sequelize: Sequelize
): Promise<boolean> {
    // undefined means that this is a new article
    if (articleId == undefined) {
        return new Promise<boolean>((res) => res(true));
    }

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

module.exports = (sequelize: Sequelize) => {
    return {
        getArticle: (articleNumber: number, userId?: string) => {
            return <Promise<undefined | JSON>>(
                new Promise(async (res, reject) => {
                    if (isNaN(articleNumber)) {
                        reject("Not a valid article number");
                    }
                    sequelize
                        .model("Article")
                        .findOne({
                            attributes: [
                                "title",
                                "description",
                                "publicationDate",
                                "updatedDate",
                                "timeToComplete",
                                "viewCounter",
                                "published",
                                "authorId",
                            ],
                            where: { id: articleNumber },
                            include: [
                                {
                                    model: sequelize.model("File"),
                                    attributes: ["name", "id"],
                                    required: false,
                                },
                                {
                                    model: sequelize.model("Image"),
                                    attributes: ["fileId", "altText"],
                                    required: false,
                                },
                                {
                                    model: sequelize.model("Subject"),
                                    attributes: ["id", "name"],
                                    required: false,
                                    through: { attributes: [] },
                                },
                                {
                                    model: sequelize.model("User"),
                                    required: true,
                                    attributes: ["username"],
                                },
                                {
                                    model: sequelize.model("Theme"),
                                    required: false,
                                    attributes: ["name"],
                                    through: { attributes: [] },
                                },
                                {
                                    model: sequelize.model("Grade"),
                                    required: false,
                                    attributes: ["name"],
                                    through: { attributes: [] },
                                },
                                {
                                    model: sequelize.model("Tool"),
                                    required: false,
                                    attributes: ["name"],
                                    through: { attributes: [] },
                                },
                            ],
                        })
                        .then(async (oneArticle: any) => {
                            if (oneArticle != null) {
                                if (!oneArticle.dataValues.published) {
                                    if (
                                        oneArticle.dataValues.authorId == userId
                                    ) {
                                        delete oneArticle.dataValues[
                                            "authorId"
                                        ];
                                        res(oneArticle.dataValues);
                                    } else if (
                                        await userFeatures.isAdmin(
                                            userId,
                                            sequelize
                                        )
                                    ) {
                                        delete oneArticle.dataValues[
                                            "authorId"
                                        ];
                                        res(oneArticle.dataValues);
                                    } else reject("access denied");
                                } else {
                                    delete oneArticle.dataValues["authorId"];
                                    res(oneArticle.dataValues);
                                }
                            } else {
                                reject("can't find article");
                            }
                        })
                        .catch((erro: JSON) => reject(erro));
                })
            );
        },
        createArticle: (req: IArticle) => {
            return <Promise<JSON | IArticle>>(
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
                                    .then((articeCreated: any) => {
                                        if (articeCreated.id) {
                                            // file data from forms
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
                                                            .create({
                                                                ArticleId:
                                                                    articeCreated.id,
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
                                                // image data from forms
                                                article.images.map(
                                                    async (oneImage) => {
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
                                                                            oneImage.file_name
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
                                                            .model("Image")
                                                            .create({
                                                                ArticleId:
                                                                    articeCreated.id,
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
                                                            .create({
                                                                articleArticleId:
                                                                    articeCreated.id,
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
                                                            .create({
                                                                ArticleId:
                                                                    articeCreated.id,
                                                                tool_id:
                                                                    oneTool.id,
                                                            });
                                                    }
                                                );
                                            }
                                        }
                                        res(articeCreated);
                                    })
                                    .catch((er: any) => {
                                        console.error(er);
                                        error("cant create article");
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
