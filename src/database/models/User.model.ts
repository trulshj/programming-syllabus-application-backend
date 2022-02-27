import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../app";

export const User = sequelize.define<Model<any, any>, unknown>(
    "User",
    {
        id: {
            type: DataTypes.STRING(64),
            primaryKey: true,
            unique: true,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(64),
        },
        salt: {
            type: DataTypes.STRING(64),
        },
        roleId: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        createdAt: true,
        updatedAt: true,
    }
);
