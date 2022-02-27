export interface IArticle {
    title: string;
    id?: number;
    description: string;
    publication_date?: string;
    change_date?: string;
    time_to_complete?: number;
    view_counter?: number;
    published?: boolean;
    files: {
        file_name: string;
        file_id: string;
    }[];
    images: {
        file_id: string;
        alt_text: string;
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
    grade_levels: {
        name: string;
        id: number;
    }[];
    tools: {
        name: string;
        id: number;
    }[];
    author_id: string;
}
