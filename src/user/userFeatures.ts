// file for sharing methods with other function on the server

import { Sequelize } from "sequelize";
import { IUser } from "./IUser";
import { pbkdf2 } from "crypto";

module.exports = {
    isAdmin(userId: string, sequelize: Sequelize): Promise<boolean> {
        return new Promise<boolean>((res) => {
            if (userId == undefined) {
                res(false);
            } else {
                //checking if user is admin
                sequelize
                    .model("user")
                    .count({
                        where: {
                            user_id: userId,
                            role_id: 1,
                        },
                    })
                    .then((userCount) => {
                        if (userCount == 1) {
                            res(true);
                        } else {
                            res(false);
                        }
                    });
            }
        });
    },
    logInUser(user: IUser, sequelize: Sequelize): Promise<IUser> {
        return new Promise<IUser>((res: any, error: any) => {
            sequelize
                .model("user")
                .findOne({
                    where: {
                        email: user.email,
                    },
                })
                .then((userRes) => {
                    if (userRes != undefined) {
                        pbkdf2(
                            user.password
                                ? user.password
                                : error("password not specified"),
                            userRes.getDataValue("salt"),
                            100,
                            32,
                            "sha256",
                            async (passwordError, slatedPassowrd) => {
                                if (
                                    slatedPassowrd.toString("hex") ==
                                    userRes.getDataValue("password")
                                ) {
                                    //todo setup some sort of token or session here

                                    res({
                                        user_id:
                                            userRes.getDataValue("user_id"),
                                        username:
                                            userRes.getDataValue("username"),
                                        email: userRes.getDataValue("email"),
                                        role_id:
                                            userRes.getDataValue("role_id"),
                                        verified:
                                            userRes.getDataValue("verified"),
                                        createdAt:
                                            userRes.getDataValue("createdAt"),
                                        updatedAt:
                                            userRes.getDataValue("updatedAt"),
                                    });
                                } else {
                                    error("Password dont match");
                                }
                            }
                        );
                    } else {
                        error("error fetching user");
                    }
                });
        });
    },
};
