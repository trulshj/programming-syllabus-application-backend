import { File } from "../database/models/File.model";
import { FileInfo } from "../types/FileDto";

const artifactPath = "./artifacts/";

export async function get(fileId: string) {
    return new Promise<FileInfo>(async (res, error) => {
        const file = await File.findByPk(fileId);

        if (!file) {
            error("Could not find file");
            return;
        }

        res({
            path: artifactPath + file.hash,
            name: file.name,
        });
    });
}

export async function create(
    articleId: number,
    hash: string,
    name: string,
    altText?: string
) {
    return new Promise<File>(async (res, error) => {
        const file = await File.create({
            hash: hash,
            name: name,
            altText: altText,
            articleId: articleId,
        });

        res(file);
    });
}
export async function remove(fileId: number) {
    return new Promise<number>(async (res, err) => {
        const affectedRows = await File.destroy({
            where: { id: fileId },
        });

        if (affectedRows < 1) {
            err("Could not delete row");
            return;
        }

        res(fileId);
    });
}
