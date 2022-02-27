export interface IArticle {
    title: string;
    id?: number;
    description: string;
    publicationDate?: string;
    updatedDate?: string;
    timeToComplete?: number;
    viewCounter?: number;
    published?: boolean;
    files: {
        file_name: string;
        fileId: string;
    }[];
    images: {
        fileId: string;
        altText: string;
        file_name: string;
    }[];
    subjects: {
        id: string;
        name: string;
    }[];
    user: {
        username: string;
    };
    themes: {
        name: string;
        id: number;
    }[];
    grades: {
        name: string;
        id: number;
    }[];
    tools: {
        name: string;
        id: number;
    }[];
    authorId: string;
}
