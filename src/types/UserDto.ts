export interface UserDto {
    id?: string | undefined;
    username: string;
    email: string;
    roleId?: number;
    verified?: boolean;
}
