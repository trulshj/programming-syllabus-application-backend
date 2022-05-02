import { sequelizeInstance } from "../app";
import { ArticleDto } from "../types/ArticleDto";

import formidable = require("formidable");

function oldCreateArticle(req: any) {
    return <Promise<JSON | ArticleDto>>new Promise((res: any, error: any) => {
        try {
            let article: ArticleDto;
            const form = formidable.formidable({
                multiples: true,
                maxFileSize: 1024 * 1024 * 1024, // 1GB
                uploadDir: "./artifacts",
            });

            form.parse(req, async (err: any, fields: any, files: any) => {
                if (err) {
                    console.error(err);
                    return;
                }
                article = JSON.parse(fields.body);
                //article data from json

                await sequelizeInstance
                    .model("Article")
                    .create({
                        title: article.title,
                        description: article.description,
                        timeToComplete: article.timeToComplete,
                        authorId: article.author.id,
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
                                    await sequelizeInstance
                                        .model("File")
                                        .create({
                                            ArticleId: createdArticle.id,
                                            file_name: oneFile.file_name,
                                            fileId: fomrsFile.path.split(
                                                "/"
                                            )[1],
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
