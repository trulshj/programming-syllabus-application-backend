import { ModelCtor } from "@sequelize/core";
const fileReader = require("fs");
module.exports = (artifactpath: string) => {
    return {
        getFile(
            fileDatabase: ModelCtor<any>,
            imageDatabase: ModelCtor<any>,
            fileSha: string
        ) {
            return <Promise<undefined | string[]>>new Promise(async (res) => {
                // images
                await imageDatabase
                    .findOne({
                        attributes: ["fileId"],
                        where: {
                            fileId: fileSha,
                        },
                    })
                    .then(async (oneImage) => {
                        if (oneImage != undefined) {
                            fileReader.stat(
                                artifactpath + oneImage.fileId,
                                (error: any) => {
                                    if (!error) {
                                        res([artifactpath + oneImage.fileId]);
                                        return;
                                    } else {
                                        console.log(
                                            "image not on disk",
                                            fileSha
                                        );
                                        console.log(error ? error : "");
                                        res(undefined);
                                    }
                                }
                            );
                        } else {
                            // generic files
                            await fileDatabase
                                .findOne({
                                    attributes: ["fileId", "file_name"],
                                    where: {
                                        fileId: fileSha,
                                    },
                                })
                                .then(async (oneFile) => {
                                    if (oneFile != undefined) {
                                        await fileReader.stat(
                                            artifactpath + oneFile.fileId,
                                            (error: any) => {
                                                if (!error) {
                                                    res([
                                                        artifactpath +
                                                            oneFile.fileId,
                                                        oneFile.file_name,
                                                    ]);
                                                } else {
                                                    console.log(
                                                        "file not on disk",
                                                        fileSha
                                                    );
                                                    console.log(
                                                        error ? error : ""
                                                    );
                                                    res(undefined);
                                                }
                                            }
                                        );
                                    } else {
                                        console.log("not a file");
                                        res(undefined);
                                    }
                                });
                        }
                    });
            });
        },
    };
};
