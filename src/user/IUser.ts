export interface IUser {
    user_id?: string | undefined;
    username: string;
    email: string;
    password?: string;
    salt?: string;
    roleId?: number;
    verified?: boolean;
}
