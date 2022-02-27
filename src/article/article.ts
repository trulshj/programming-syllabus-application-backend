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
                    if (oneArticle.author_id == userId) {
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
                new Promise(async (res, error) => {
                    if (!isNaN(articleNumber)) {
                        sequelize
                            .model("Article")
                            .findOne({
                                attributes: [
                                    "title",
                                    "description",
                                    "publication_date",
                                    "change_date",
                                    "time_to_complete",
                                    "view_counter",
                                    "published",
                                    "author_id",
                                ],
                                where: { id: articleNumber },
                                include: [
                                    {
                                        attributes: ["name", "id"],
                                        model: sequelize.model("file"),
                                        required: false,
                                    },
                                    {
                                        attributes: ["file_id", "alt_text"],
                                        model: sequelize.model("image"),
                                        required: false,
                                    },
                                    {
                                        attributes: ["id", "name"],
                                        model: sequelize.model("subject"),
                                        required: false,
                                        through: { attributes: [] },
                                    },
                                    {
                                        model: sequelize.model("user"),
                                        required: true,
                                        attributes: ["username"],
                                    },
                                    {
                                        model: sequelize.model("theme"),
                                        required: false,
                                        attributes: ["name"],
                                        through: { attributes: [] },
                                    },
                                    {
                                        model: sequelize.model("grade_level"),
                                        required: false,
                                        attributes: ["name"],
                                        through: { attributes: [] },
                                    },
                                    {
                                        model: sequelize.model("tool"),
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
                                            oneArticle.dataValues.author_id ==
                                            userId
                                        ) {
                                            delete oneArticle.dataValues[
                                                "author_id"
                                            ];
                                            res(oneArticle.dataValues);
                                        } else if (
                                            await userFeatures.isAdmin(
                                                userId,
                                                sequelize
                                            )
                                        ) {
                                            delete oneArticle.dataValues[
                                                "author_id"
                                            ];
                                            res(oneArticle.dataValues);
                                        } else error("access denied");
                                    } else {
                                        delete oneArticle.dataValues[
                                            "author_id"
                                        ];
                                        res(oneArticle.dataValues);
                                    }
                                } else {
                                    error("can't find article");
                                }
                            })
                            .catch((erro: JSON) => error(erro));
                    } else {
                        error("not a valid article url");
                    }
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
                                        time_to_complete:
                                            article.time_to_complete,
                                        author_id: article.author_id,
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
                                                            .model("file")
                                                            .create({
                                                                article_id:
                                                                    articeCreated.id,
                                                                file_name:
                                                                    oneFile.file_name,
                                                                file_id:
                                                                    fomrsFile.path.split(
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
                                                            .model("image")
                                                            .create({
                                                                article_id:
                                                                    articeCreated.id,
                                                                alt_text:
                                                                    oneImage.alt_text,
                                                                file_id:
                                                                    fomrsFile.path.split(
                                                                        "/"
                                                                    )[1],
                                                            });
                                                    }
                                                );
                                            }

                                            if (
                                                article.grade_levels !=
                                                undefined
                                            ) {
                                                article.grade_levels.map(
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
                                                                article_id:
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
                                    await verifyUser(
                                        article.author_id,
                                        articleId,
                                        sequelize
                                    )
                                ) {
                                    await sequelize
                                        .model("Article")
                                        .update(
                                            {
                                                title: article.title,
                                                description:
                                                    article.description,
                                                time_to_complete:
                                                    article.time_to_complete,
                                            },
                                            {
                                                silent: await userFeatures.isAdmin(
                                                    article.author_id,
                                                    sequelize
                                                ),
                                                where: {
                                                    id: articleId,
                                                },
                                            }
                                        )
                                        .then(
                                            async (sequlizeResponse: any[]) => {
                                                if (article.id != undefined) {
                                                    if (
                                                        article.files !=
                                                        undefined
                                                    ) {
                                                        article.files.map(
                                                            async (
                                                                oneFile: any
                                                            ) => {
                                                                let fomrsFile: any =
                                                                    "";
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
                                                                    .model(
                                                                        "file"
                                                                    )
                                                                    .upsert({
                                                                        id: article.id,
                                                                        file_name:
                                                                            oneFile.file_name,
                                                                        file_id:
                                                                            fomrsFile.path.split(
                                                                                "/"
                                                                            )[1],
                                                                    });
                                                            }
                                                        );
                                                    }

                                                    if (
                                                        article.images !=
                                                        undefined
                                                    ) {
                                                        article.images.map(
                                                            async (
                                                                oneImage
                                                            ) => {
                                                                let fomrsFile: any =
                                                                    "";
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
                                                                    .model(
                                                                        "image"
                                                                    )
                                                                    .upsert({
                                                                        id: article.id,
                                                                        alt_text:
                                                                            oneImage.alt_text,
                                                                        file_id:
                                                                            fomrsFile.path.split(
                                                                                "/"
                                                                            )[1],
                                                                    });
                                                            }
                                                        );
                                                    }

                                                    if (
                                                        article.grade_levels !=
                                                        undefined
                                                    ) {
                                                        article.grade_levels.map(
                                                            async (
                                                                oneGrade
                                                            ) => {
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

                                                    if (
                                                        article.tools !=
                                                        undefined
                                                    ) {
                                                        article.tools.map(
                                                            async (oneTool) => {
                                                                await sequelize
                                                                    .model(
                                                                        "ToolArticle"
                                                                    )
                                                                    .upsert({
                                                                        article_id:
                                                                            article.id,
                                                                        tool_id:
                                                                            oneTool.id,
                                                                    });
                                                            }
                                                        );
                                                    }
                                                }
                                                res(sequlizeResponse);
                                            }
                                        )
                                        .catch((err: any) => {
                                            console.error(err);
                                            error("cant update article");
                                        });
                                } else {
                                    error("user not allowed to update article");
                                }
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
