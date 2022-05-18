export interface TagDto {
    id: number;
    name: string;
    tagType: TagType;
}

export type TagType = "grade" | "subject" | "tool" | "theme";
