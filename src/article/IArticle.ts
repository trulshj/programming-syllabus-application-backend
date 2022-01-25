export interface IArticle {
    article_title: string;
    article_id?: number;
    article_description: string;
    publication_date?: string;
    article_change_date?: string;
    time_to_complete?: number;
    view_counter?: number;
    published?: boolean;
    files?: [
        {
            file_name: string;
            file_id: string;
        }
    ];
    images?: [
        {
            file_id: string;
            alt_text: string;
            file_name: string;
        }
    ];
    subjects?: [
        {
            subject_id: string;
            subject_name: string;
        }
    ];
    user: {
        username: string;
    };
    themes: [{ theme_name: string }];
    grade_levels: [
        {
            grade_name: string;
            grade_id: number;
        }
    ];
    tools: [
        {
            tool_name: string;
            tool_id: number;
        }
    ];
    author_id: string;
}
