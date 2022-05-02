import { sequelizeInstance } from "../app";
import { Tag } from "../database/models/Tag.model";
import { TagDto } from "../types/TagDto";

function tagArticle() {
    return sequelizeInstance.model("TagArticle");
}

export async function getAll() {}
export async function get() {}
export async function create(tagType: number, name: string) {
    return new Promise<Tag>(async (res, error) => {
        const tag = await Tag.create({ name: name, tagType: tagType });

        if (!tag) {
            error("Could not find tag");
            return;
        }

        res(tag);
    });
}

export async function update(newTag: TagDto) {
    return new Promise<Tag>(async (res, error) => {
        const tag = await Tag.findByPk(newTag.id);

        if (!tag) {
            error("Could not find tag");
            return;
        }

        tag.setDataValue("name", newTag.name);

        res(tag);
    });
}

export async function remove() {}

export async function addArticleTags(articleId: number, tags: TagDto[]) {
    for (let tag of tags) {
        await tagArticle().create({ ArticleId: articleId, TagId: tag.id });
    }
}

export async function clearArticleTags(articleId: number) {
    await tagArticle().destroy({ where: { ArticleId: articleId } });
}
