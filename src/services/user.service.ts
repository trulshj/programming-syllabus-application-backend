import { User } from "../database/models/User.model";
import { getRandomString } from "../utils/helper";
import { UserDto } from "../types/UserDto";
import { where } from "sequelize/types";

export async function login(email: string, password: string): Promise<UserDto> {
    return new Promise<UserDto>(async (res, error) => {
        const user = await User.findOne({
            where: { email: email },
        });

        if (!user) {
            error(`Could not find user with email "${email}"`);
            return;
        }

        if (user.comparePassword(password)) {
            res(user.getDto());
        } else {
            error("Incorrect Password");
        }
        return;
    });
}

export async function get(userId: string) {
    return new Promise<UserDto>(async (res, error) => {
        const user = await User.findByPk(userId);

        if (!user) {
            error("Could not find user");
            return;
        }

        res(user.getDto());
    });
}

export async function getAllUsers() {
    return new Promise<UserDto[]>(async (res, error) => {
        const users = await User.findAll();
        res(users.map((x) => x.getDto()));
    });
}

export async function create(
    username: string,
    email: string,
    password: string
) {
    return new Promise<UserDto>(async (res, error) => {
        const usernameCheck = await User.findAndCountAll({
            where: {
                username: username,
            },
        });

        if (usernameCheck.count) {
            error("Username already taken");
            return;
        }

        const emailCheck = await User.findAndCountAll({
            where: { email: email },
        });

        if (emailCheck.count) {
            error("Email already in use");
            return;
        }

        const user = await User.create({
            id: getRandomString(),
            username: username,
            email: email,
            password: password,
            roleId: 0,
            verified: true,
        });

        res(user.getDto());
    });
}

export async function update(
    userId: string,
    newUsername: string,
    newEmail: string,
    newPassword?: string
) {
    return new Promise<UserDto>(async (res, error) => {
        if (newPassword) {
            await User.update(
                {
                    username: newUsername,
                    email: newEmail,
                    password: newPassword,
                },
                {
                    where: { id: userId },
                }
            );
        } else {
            await User.update(
                {
                    username: newUsername,
                    email: newEmail,
                },
                {
                    where: { id: userId },
                }
            );
        }

        const updatedUser = await User.findByPk(userId);

        if (!updatedUser) {
            error("Could not get user after updating");
            return;
        }

        res(updatedUser.getDto());
    });
}
