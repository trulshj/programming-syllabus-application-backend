import { FileDto } from "./FileDto";
import { TagDto } from "./TagDto";

export interface ArticleDto {
    title: string;
    id?: number;
    description: string;
    creationDate?: Date;
    updatedDate?: Date;
    timeToComplete?: number;
    viewCounter?: number;
    published?: boolean;
    files: FileDto[];
    tags: TagDto[];
    author: {
        username: string;
        id: string;
    };
}
