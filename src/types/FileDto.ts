export interface FileDto {
    id: string;
    hash: string;
    name: string;
    altText: string | undefined;
}

export interface FileInfo {
    path: string;
    name: string;
}
