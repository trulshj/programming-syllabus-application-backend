import { Sequelize, Op } from "@sequelize/core";
import { pbkdf2, randomBytes } from "crypto";
import { User } from "../database/models/User.model";
import { IUser } from "./IUser";

// 32 byte converted to hex is 32*2 => 64
async function getRandomString(): Promise<string> {
    return <Promise<string>>new Promise((resolve) => {
        randomBytes(32, async (error, randomBuffer) => {
            resolve(randomBuffer.toString("hex"));
        });
    });
}

export async function getUser(userId: string) {
    return User.findByPk(userId);
}

export async function updateUser(user: IUser) {
    const salt: any = await getRandomString();
    return await new Promise<{ success: boolean; message: string }>(
        (resolve, reject) => {
            pbkdf2(
                user.password as string,
                salt,
                100,
                32,
                "sha256",
                async (error, derivedKey) => {
                    if (error) {
                        reject({ success: false, message: error.message });
                    }

                    const [numberOfRows, updatedUser] = await User.update(
                        {
                            username: user.username,
                            email: user.email,
                            password: derivedKey.toString("hex"),
                            salt: salt,
                        },
                        {
                            where: {
                                id: user.id,
                            },
                        }
                    );

                    resolve({
                        success: true,
                        message: `User ${updatedUser[0].username} successfully updated`,
                    });
                }
            );
        }
    );
}
/*
        createUser(newUser: IUser) {
            return <Promise<undefined | string>>new Promise(async (res) => {
                const { randomBytes, pbkdf2 } = await import("crypto");
                await sequelize
                    .model("user")
                    .findAndCountAll({
                        where: {
                            [Op.or]: [
                                {
                                    username: newUser.username,
                                },
                                {
                                    email: newUser.email,
                                },
                            ],
                        },
                    })
                    .then(async (countRes) => {
                        if (countRes.count <= 0) {
                            const salt: any = await getRandomString();

                            pbkdf2(
                                newUser.password as string,
                                salt,
                                100,
                                32,
                                "sha256",
                                async (passwordError, slatedPassowrd) => {
                                    if (!passwordError) {
                                        await sequelize
                                            .model("user")
                                            .create({
                                                user_id:
                                                    await getRandomString(),
                                                username: newUser.username,
                                                email: newUser.email,
                                                password:
                                                    slatedPassowrd.toString(
                                                        "hex"
                                                    ),
                                                salt: salt,
                                            })
                                            .then((resUser) => {
                                                if (
                                                    resUser.getDataValue(
                                                        "username"
                                                    ) == newUser.username
                                                ) {
                                                    res("user created");
                                                }
                                            })
                                            .catch((error) => {
                                                console.log(
                                                    "create user error:",
                                                    error
                                                        ? error
                                                        : "no error specified"
                                                );
                                                res(undefined);
                                            });
                                    }
                                }
                            );
                        } else {
                            res(undefined);
                        }
                    });
            });
        },
        updateUser(user: IUser) {
            return <Promise<string>>new Promise(async (res, error: any) => {
                const salt: string = await getRandomString();
                pbkdf2(
                    user.password as string,
                    salt,
                    100,
                    32,
                    "sha256",
                    async (passwordError, slatedPassowrd) => {
                        sequelize
                            .model("user")
                            .update(
                                {
                                    username: user.username,
                                    email: user.email,
                                    password: slatedPassowrd.toString("hex"),
                                    salt: salt,
                                },
                                {
                                    where: {
                                        user_id: user.id,
                                    },
                                }
                            )
                            .then(() => res("updated"))
                            .catch((err: any) => {
                                console.error(err);
                                error(err);
                            });
                    }
                );
            });
        },
    };
};
*/
