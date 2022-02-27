import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../app";

export const Theme = sequelize.define<Model<any, any>, unknown>(
    "Theme",
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
        },
    },
    {
        createdAt: false,
        updatedAt: false,
    }
);
